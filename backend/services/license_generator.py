"""License PDF generation service."""
import logging
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, Spacer, SimpleDocTemplate

from backend.config import PRODUCER_NAME, LICENSOR_LEGAL_NAME, SUPABASE_URL
from backend.database import supabase

logger = logging.getLogger(__name__)

# Template file mapping
LICENSE_TEMPLATE_MAP = {
    "mp3_non_exclusive": "mp3_non_exclusive.txt",
    "wav_non_exclusive": "wav_non_exclusive.txt",
    "premium_trackout_non_exclusive": "premium_trackout_non_exclusive.txt",
    "premium_trackout_exclusive": "premium_trackout_exclusive.txt",
}

# Get template directory path
TEMPLATE_DIR = Path(__file__).parent.parent / "license_templates" / "templates"


def _load_template(license_type: str) -> Optional[str]:
    """Load license template by license type."""
    template_file = LICENSE_TEMPLATE_MAP.get(license_type)
    if not template_file:
        logger.error(f"Unknown license type: {license_type}")
        return None
    
    template_path = TEMPLATE_DIR / template_file
    if not template_path.exists():
        logger.error(f"Template file not found: {template_path}")
        return None
    
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        logger.error(f"Error reading template file {template_path}: {e}")
        return None


def _replace_placeholders(
    template: str,
    effective_date: str,
    licensor_legal_name: str,
    producer_name: str,
    licensee_name: str,
    licensee_email: str,
    license_number: str,
    composition_title: str,
) -> str:
    """Replace placeholders in template with actual values."""
    replacements = {
        "[EFFECTIVE DATE – AUTO GENERATED]": effective_date,
        "[LICENSOR LEGAL NAME / LLC NAME]": licensor_legal_name,
        "[PRODUCER NAME]": producer_name,
        "[LICENSEE NAME]": licensee_name,
        "[LICENSEE EMAIL]": licensee_email,
        "[LICENSE NUMBER / ORDER ID]": license_number,
        "[COMPOSITION TITLE]": composition_title,
    }
    
    result = template
    for placeholder, value in replacements.items():
        result = result.replace(placeholder, value)
    
    return result


def _create_pdf(content: str, output_path: str) -> bool:
    """Generate PDF from text content using ReportLab."""
    try:
        # Create PDF document
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72,
        )
        
        # Create styles
        styles = getSampleStyleSheet()
        normal_style = styles["Normal"]
        normal_style.fontSize = 10
        normal_style.leading = 12
        normal_style.spaceAfter = 6
        
        # Build story (content)
        story = []
        
        # Split content into lines and process
        lines = content.split("\n")
        for line in lines:
            line = line.strip()
            if not line:
                story.append(Spacer(1, 0.1 * inch))
            else:
                # Handle bullet points
                if line.startswith("*"):
                    # Remove asterisk and add as paragraph
                    text = line[1:].strip()
                    story.append(Paragraph(f"• {text}", normal_style))
                else:
                    story.append(Paragraph(line, normal_style))
        
        # Build PDF
        doc.build(story)
        return True
    except Exception as e:
        logger.error(f"Error creating PDF: {e}")
        return False


def _upload_to_storage(pdf_path: str, order_id: str, license_id: str) -> Optional[str]:
    """Upload PDF to Supabase Storage and return public URL."""
    try:
        # Read PDF file
        with open(pdf_path, "rb") as f:
            pdf_data = f.read()
        
        # Create storage path
        storage_path = f"licenses/{order_id}/{license_id}.pdf"
        
        # Upload to Supabase Storage
        # Python supabase client storage API
        storage_bucket = supabase.storage.from_("beats")
        
        # Upload file - returns (data, error) tuple
        data, error = storage_bucket.upload(
            storage_path,
            pdf_data,
            file_options={"content-type": "application/pdf"},
        )
        
        if error:
            logger.error(f"Failed to upload PDF to storage: {error}")
            return None
        
        # Get public URL - returns dict with publicUrl key
        url_result = storage_bucket.get_public_url(storage_path)
        
        # Extract public URL from result
        # Python client get_public_url returns dict with 'publicUrl' key
        if isinstance(url_result, dict):
            public_url = url_result.get("publicUrl") or url_result.get("public_url")
            if public_url:
                return public_url
        elif hasattr(url_result, 'publicUrl'):
            return url_result.publicUrl
        elif hasattr(url_result, 'public_url'):
            return url_result.public_url
        
        # If we can't extract URL, construct it manually
        # Format: {SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}
        return f"{SUPABASE_URL}/storage/v1/object/public/beats/{storage_path}"
            
    except Exception as e:
        logger.error(f"Error uploading PDF to storage: {e}", exc_info=True)
        return None
    finally:
        # Clean up local file
        try:
            if os.path.exists(pdf_path):
                os.remove(pdf_path)
        except Exception as e:
            logger.warning(f"Error removing temporary PDF file: {e}")


def generate_license_pdf(
    license_type: str,
    order_id: str,
    customer_name: str,
    customer_email: str,
    beat_title: str,
    producer_name: Optional[str] = None,
    licensor_legal_name: Optional[str] = None,
    purchase_date: Optional[datetime] = None,
) -> Optional[str]:
    """
    Generate a license agreement PDF and upload to storage.
    
    Args:
        license_type: One of the four license types
        order_id: Order ID (UUID string)
        customer_name: Customer name from Stripe
        customer_email: Customer email from Stripe
        beat_title: Beat title from database
        producer_name: Producer name (defaults to PRODUCER_NAME env var)
        licensor_legal_name: Licensor legal name (defaults to LICENSOR_LEGAL_NAME env var)
        purchase_date: Purchase date (defaults to current date)
    
    Returns:
        Public URL of the generated PDF, or None if generation failed
    """
    try:
        # Use defaults if not provided
        if producer_name is None:
            producer_name = PRODUCER_NAME
        if licensor_legal_name is None:
            licensor_legal_name = LICENSOR_LEGAL_NAME
        if purchase_date is None:
            purchase_date = datetime.now()
        
        # Format effective date
        effective_date = purchase_date.strftime("%B %d, %Y")
        
        # Generate license ID
        license_id = str(uuid.uuid4())
        
        # Load template
        template = _load_template(license_type)
        if not template:
            logger.error(f"Failed to load template for license type: {license_type}")
            return None
        
        # Replace placeholders
        filled_content = _replace_placeholders(
            template=template,
            effective_date=effective_date,
            licensor_legal_name=licensor_legal_name,
            producer_name=producer_name,
            licensee_name=customer_name or "Unknown",
            licensee_email=customer_email or "Unknown",
            license_number=order_id,
            composition_title=beat_title or "Unknown Beat",
        )
        
        # Create temporary PDF file
        temp_dir = Path("/tmp")
        temp_dir.mkdir(exist_ok=True)
        temp_pdf_path = str(temp_dir / f"license_{license_id}.pdf")
        
        # Generate PDF
        if not _create_pdf(filled_content, temp_pdf_path):
            logger.error("Failed to create PDF")
            return None
        
        # Upload to storage
        public_url = _upload_to_storage(temp_pdf_path, order_id, license_id)
        
        if public_url:
            logger.info(f"Successfully generated license PDF: {public_url}")
            return public_url
        else:
            logger.error("Failed to upload PDF to storage")
            return None
            
    except Exception as e:
        logger.error(f"Error generating license PDF: {e}", exc_info=True)
        return None


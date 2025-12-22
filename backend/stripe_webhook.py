"""Stripe webhook handler for checkout.session.completed events."""
import logging
import uuid

import stripe
from fastapi import APIRouter, Request, Header
from fastapi.responses import Response

from backend.config import STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
from backend.database import supabase

# Initialize Stripe
stripe.api_key = STRIPE_SECRET_KEY

# Set up logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(..., alias="stripe-signature"),
) -> Response:
    """
    Handle Stripe webhook events.
    
    Only processes checkout.session.completed events.
    Creates order, order_item, and license records.
    Deactivates beat if license_type is 'exclusive'.
    """
    payload = await request.body()
    
    try:
        # Verify webhook signature
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        logger.error(f"Invalid payload: {e}")
        return Response(status_code=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {e}")
        return Response(status_code=400)
    
    # Only handle checkout.session.completed events
    if event["type"] != "checkout.session.completed":
        logger.info(f"Ignoring event type: {event['type']}")
        return Response(status_code=200)
    
    try:
        session = event["data"]["object"]
        metadata = session.get("metadata", {})
        
        # Fail fast if required metadata is missing
        beat_id_str = metadata.get("beat_id")
        license_type = metadata.get("license_type")
        
        if not beat_id_str:
            logger.error("Missing required metadata: beat_id")
            return Response(status_code=200)  # Return 200 to prevent Stripe retries
        
        if not license_type:
            logger.error("Missing required metadata: license_type")
            return Response(status_code=200)
        
        # Parse beat_id
        try:
            beat_id = uuid.UUID(beat_id_str)
        except ValueError:
            logger.error(f"Invalid beat_id format: {beat_id_str}")
            return Response(status_code=200)
        
        # Extract user_id from metadata if present (nullable)
        user_id = None
        if "user_id" in metadata:
            try:
                user_id = uuid.UUID(metadata["user_id"])
            except ValueError:
                logger.warning(f"Invalid user_id format: {metadata['user_id']}, proceeding without user_id")
        
        # Extract other required fields
        checkout_id = session.get("id")
        total_cents = session.get("amount_total", 0)
        price_cents = total_cents  # For single-item checkout
        
        # Generate license URL (placeholder - adjust based on your license generation logic)
        license_url = f"https://example.com/licenses/{uuid.uuid4()}"
        
        # Database operations
        # 1. Insert order
        order_data = {
            "user_id": str(user_id) if user_id else None,
            "stripe_checkout_id": checkout_id,
            "total_cents": total_cents,
            "status": "completed",
        }
        
        order_result = supabase.table("orders").insert(order_data).execute()
        if not order_result.data:
            logger.error("Failed to insert order")
            return Response(status_code=200)
        
        order_id = order_result.data[0]["id"]
        
        # 2. Insert order_item
        order_item_data = {
            "order_id": order_id,
            "beat_id": str(beat_id),
            "license_type": license_type,
            "price_cents": price_cents,
        }
        
        order_item_result = supabase.table("order_items").insert(order_item_data).execute()
        if not order_item_result.data:
            logger.error("Failed to insert order_item")
            return Response(status_code=200)
        
        order_item_id = order_item_result.data[0]["id"]
        
        # 3. Insert license
        license_data = {
            "order_item_id": order_item_id,
            "user_id": str(user_id) if user_id else None,
            "beat_id": str(beat_id),
            "license_type": license_type,
            "license_url": license_url,
        }
        
        license_result = supabase.table("licenses").insert(license_data).execute()
        if not license_result.data:
            logger.error("Failed to insert license")
            return Response(status_code=200)
        
        # 4. If license_type is 'exclusive', deactivate the beat
        if license_type.lower() == "exclusive":
            try:
                supabase.table("beats").update({"is_active": False}).eq("id", str(beat_id)).execute()
                logger.info(f"Deactivated beat {beat_id} due to exclusive license")
            except Exception as e:
                logger.error(f"Failed to deactivate beat {beat_id}: {e}")
                # Continue - license was created successfully
        
        logger.info(f"Successfully processed checkout for beat {beat_id}, license_type {license_type}")
        return Response(status_code=200)
        
    except Exception as e:
        # Log error but return 200 to prevent Stripe retries
        logger.error(f"Error processing webhook: {e}", exc_info=True)
        return Response(status_code=200)


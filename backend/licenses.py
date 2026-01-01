"""License management API endpoints."""
from fastapi import APIRouter, HTTPException
from backend.database import supabase

router = APIRouter(prefix="/api/licenses", tags=["licenses"])


@router.get("/")
async def list_licenses():
    """Get all licenses with order_items, beats, and orders - Admin only."""
    try:
        result = supabase.table("licenses").select(
            """
            *,
            order_items (
                *,
                beats (*),
                orders (*)
            )
            """
        ).order("created_at", desc=True).execute()
        
        return {"success": True, "data": result.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching licenses: {str(e)}")


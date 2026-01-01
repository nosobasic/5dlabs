"""Webhook events API endpoints."""
from fastapi import APIRouter, HTTPException
from backend.database import supabase

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])


@router.get("/")
async def list_webhook_events():
    """Get all webhook events - Admin only."""
    try:
        result = supabase.table("webhook_events").select("*").order("created_at", desc=True).limit(100).execute()
        
        return {"success": True, "data": result.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching webhook events: {str(e)}")


"""Order management API endpoints."""
from fastapi import APIRouter, HTTPException
from backend.database import supabase

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("/")
async def list_orders():
    """Get all orders with order_items and beats - Admin only."""
    try:
        result = supabase.table("orders").select(
            """
            *,
            order_items (
                *,
                beats (*)
            )
            """
        ).order("created_at", desc=True).execute()
        
        return {"success": True, "data": result.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")


@router.get("/{order_id}")
async def get_order(order_id: str):
    """Get an order by ID with order_items, beats, and licenses - Admin only."""
    try:
        result = supabase.table("orders").select(
            """
            *,
            order_items (
                *,
                beats (*),
                licenses (*)
            )
            """
        ).eq("id", order_id).single().execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"success": True, "data": result.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching order: {str(e)}")


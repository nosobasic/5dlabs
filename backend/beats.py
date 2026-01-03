"""Beat management API endpoints."""
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from backend.database import supabase

router = APIRouter(prefix="/api/beats", tags=["beats"])


class BeatCreate(BaseModel):
    title: str
    bpm: Optional[int] = None
    key: Optional[str] = None
    genre: Optional[str] = None
    price_cents: int
    license_type: str
    audio_url: str
    preview_url: Optional[str] = None
    is_active: bool = True
    producer_name: Optional[str] = None
    licensor_legal_name: Optional[str] = None


class BeatUpdate(BaseModel):
    title: Optional[str] = None
    bpm: Optional[int] = None
    key: Optional[str] = None
    genre: Optional[str] = None
    price_cents: Optional[int] = None
    license_type: Optional[str] = None
    audio_url: Optional[str] = None
    preview_url: Optional[str] = None
    is_active: Optional[bool] = None
    producer_name: Optional[str] = None
    licensor_legal_name: Optional[str] = None


@router.get("/", name="list_beats")
async def list_beats():
    """Get all beats (including inactive) - Admin only."""
    try:
        result = supabase.table("beats").select("*").order("created_at", desc=True).execute()
        
        return {"success": True, "data": result.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching beats: {str(e)}")


@router.post("/", name="create_beat")
async def create_beat(beat: BeatCreate):
    """Create a new beat."""
    try:
        beat_data = beat.dict()
        result = supabase.table("beats").insert(beat_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create beat")
        
        return {"success": True, "data": result.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating beat: {str(e)}")


@router.get("/{beat_id}")
async def get_beat(beat_id: str):
    """Get a beat by ID."""
    try:
        result = supabase.table("beats").select("*").eq("id", beat_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Beat not found")
        
        return {"success": True, "data": result.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching beat: {str(e)}")


@router.delete("/{beat_id}")
async def delete_beat(beat_id: str):
    """Delete a beat."""
    try:
        result = supabase.table("beats").delete().eq("id", beat_id).execute()
        return {"success": True, "message": "Beat deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting beat: {str(e)}")


@router.patch("/{beat_id}/toggle-active")
async def toggle_beat_active(beat_id: str, is_active: bool = True):
    """Toggle beat active status."""
    try:
        result = supabase.table("beats").update({"is_active": is_active}).eq("id", beat_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Beat not found")
        
        return {"success": True, "data": result.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating beat status: {str(e)}")


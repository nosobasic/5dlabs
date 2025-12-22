"""FastAPI application entry point."""
from fastapi import FastAPI

from backend.stripe_webhook import router as stripe_router

# Initialize FastAPI app
app = FastAPI(title="Beat Store API", version="1.0.0")

# Register routers
app.include_router(stripe_router)

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Beat Store API"}


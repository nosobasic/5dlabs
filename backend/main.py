"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.stripe_webhook import router as stripe_router
from backend.beats import router as beats_router

# Initialize FastAPI app
app = FastAPI(title="Beat Store API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(stripe_router)
app.include_router(beats_router)

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Beat Store API"}


"""Configuration module for environment variables."""
import os
from typing import Optional

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def get_env_var(name: str, required: bool = True) -> Optional[str]:
    """Get environment variable, raise error if required and missing."""
    value = os.getenv(name)
    if required and not value:
        raise ValueError(f"Required environment variable {name} is not set")
    return value


# Stripe configuration
STRIPE_SECRET_KEY: str = get_env_var("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET: str = get_env_var("STRIPE_WEBHOOK_SECRET")

# Supabase configuration
SUPABASE_URL: str = get_env_var("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY: str = get_env_var("SUPABASE_SERVICE_ROLE_KEY")


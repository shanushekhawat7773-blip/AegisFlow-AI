"""
AegisFlow AI - Enterprise Configuration
Predict. Investigate. Simulate. Act.
From operational signal to verified action.
"""

from typing import List, Optional
import os


class Settings:
    PROJECT_NAME: str = "AegisFlow AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("AEGISFLOW_ENV", "demo")  # "demo", "staging", "production"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "*"
    ]
    
    # AI Provider Settings
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "deterministic")  # "deterministic" or "bedrock"
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_BEDROCK_MODEL_ID: str = os.getenv(
        "AWS_BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20240620-v1:0"
    )
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID", None)
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY", None)
    
    # Anomaly Detection Defaults
    ANOMALY_ZSCORE_THRESHOLD: float = 2.5
    EWMA_ALPHA: float = 0.3
    
    # Operational Facilities
    FACILITIES: List[str] = [
        "WH-01-SEA",  # Seattle Fulfillment Hub
        "WH-02-DFW",  # Dallas Sortation Center
        "WH-03-ORD",  # Chicago Mega-Inbound Gateway (Demo Primary)
        "WH-04-ATL",  # Atlanta Air Freight Facility
    ]


settings = Settings()

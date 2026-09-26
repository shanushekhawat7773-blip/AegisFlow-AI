"""
Amazon Bedrock AI Provider for AegisFlow AI.
Interfaces with Anthropic Claude 3.5 Sonnet / Amazon Titan via Amazon Bedrock Runtime.
Falls back gracefully to DeterministicEnterpriseProvider if credentials or network are unavailable.
"""

import json
import logging
from typing import Dict, Any, List
from .base import BaseAIProvider
from .deterministic_provider import deterministic_ai_provider
from ..config import settings

logger = logging.getLogger(__name__)


class BedrockAIProvider(BaseAIProvider):
    def __init__(self):
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        try:
            import boto3
            if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
                self.client = boto3.client(
                    "bedrock-runtime",
                    region_name=settings.AWS_REGION,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
                )
            else:
                # Use default IAM role / instance profile credentials
                self.client = boto3.client("bedrock-runtime", region_name=settings.AWS_REGION)
        except Exception as e:
            logger.info(f"Bedrock runtime not initialized ({e}). Using deterministic enterprise engine.")
            self.client = None

    def generate_investigation_summary(
        self,
        facility_name: str,
        anomalies: List[Dict[str, Any]],
        evidence: List[Dict[str, Any]]
    ) -> str:
        if not self.client:
            return deterministic_ai_provider.generate_investigation_summary(
                facility_name, anomalies, evidence
            )
        
        try:
            prompt = (
                f"You are the AegisFlow Investigation Agent for {facility_name}. "
                f"Synthesize an operational investigation summary based on these verified signals:\n"
                f"Anomalies: {json.dumps(anomalies)}\n"
                f"Evidence: {json.dumps(evidence)}\n"
                f"Respond in 3 concise, technical sentences distinguishing observed facts from causal inference."
            )
            
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 300,
                "messages": [{"role": "user", "content": prompt}]
            })
            
            response = self.client.invoke_model(
                modelId=settings.AWS_BEDROCK_MODEL_ID,
                body=body
            )
            response_body = json.loads(response.get("body").read())
            return response_body["content"][0]["text"]
        except Exception as e:
            logger.warning(f"Bedrock invocation fallback: {e}")
            return deterministic_ai_provider.generate_investigation_summary(
                facility_name, anomalies, evidence
            )

    def generate_recommendation_explanation(
        self,
        incident_id: str,
        recommended_scenario: Dict[str, Any],
        rejected_scenarios: List[Dict[str, Any]]
    ) -> str:
        if not self.client:
            return deterministic_ai_provider.generate_recommendation_explanation(
                incident_id, recommended_scenario, rejected_scenarios
            )
        
        try:
            prompt = (
                f"You are the AegisFlow Decision Agent. "
                f"Explain why scenario {recommended_scenario.get('name')} was chosen over the alternatives:\n"
                f"Chosen: {json.dumps(recommended_scenario)}\n"
                f"Rejected: {json.dumps(rejected_scenarios)}\n"
                f"Explain concisely with operational rigor."
            )
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 300,
                "messages": [{"role": "user", "content": prompt}]
            })
            response = self.client.invoke_model(
                modelId=settings.AWS_BEDROCK_MODEL_ID,
                body=body
            )
            response_body = json.loads(response.get("body").read())
            return response_body["content"][0]["text"]
        except Exception:
            return deterministic_ai_provider.generate_recommendation_explanation(
                incident_id, recommended_scenario, rejected_scenarios
            )

    def generate_executive_postmortem(
        self,
        incident_data: Dict[str, Any],
        verification_data: Dict[str, Any]
    ) -> str:
        if not self.client:
            return deterministic_ai_provider.generate_executive_postmortem(
                incident_data, verification_data
            )
        return deterministic_ai_provider.generate_executive_postmortem(
            incident_data, verification_data
        )


def get_ai_provider() -> BaseAIProvider:
    if settings.AI_PROVIDER == "bedrock":
        return BedrockAIProvider()
    return deterministic_ai_provider

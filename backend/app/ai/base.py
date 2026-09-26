"""
Abstract AI Provider Interface for AegisFlow AI.
Encapsulates reasoning and natural-language synthesis across Amazon Bedrock and deterministic offline engine.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List


class BaseAIProvider(ABC):
    @abstractmethod
    def generate_investigation_summary(
        self,
        facility_name: str,
        anomalies: List[Dict[str, Any]],
        evidence: List[Dict[str, Any]]
    ) -> str:
        """Synthesize natural-language investigation summary from verified signals."""
        pass

    @abstractmethod
    def generate_recommendation_explanation(
        self,
        incident_id: str,
        recommended_scenario: Dict[str, Any],
        rejected_scenarios: List[Dict[str, Any]]
    ) -> str:
        """Explain why the counterfactual simulation ranked an intervention first."""
        pass

    @abstractmethod
    def generate_executive_postmortem(
        self,
        incident_data: Dict[str, Any],
        verification_data: Dict[str, Any]
    ) -> str:
        """Generate high-level executive post-mortem narrative."""
        pass

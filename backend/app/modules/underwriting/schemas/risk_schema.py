from pydantic import BaseModel


class RiskResponse(BaseModel):
    risk_score: float
    risk_level: str
    explanation: str
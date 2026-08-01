from pydantic import BaseModel


class LoanRequest(BaseModel):
    agent_id: str
    loan_amount: float
    purpose: str


class LoanResponse(BaseModel):
    id: int
    status: str
    risk_level: str
    confidence_score: float
    recommended_limit: float

    class Config:
        from_attributes = True
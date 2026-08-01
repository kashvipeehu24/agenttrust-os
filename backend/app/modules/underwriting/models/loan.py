from sqlalchemy import Column, Integer, Float, String
from app.database.database import Base


class LoanRequest(Base):
    __tablename__ = "loan_requests"

    id = Column(Integer, primary_key=True, index=True)

    agent_id = Column(String, nullable=False)

    loan_amount = Column(Float, nullable=False)

    purpose = Column(String, nullable=False)

    status = Column(String, default="Pending")

    risk_level = Column(String, default="Medium")

    confidence_score = Column(Float, default=0)

    recommended_limit = Column(Float, default=0)
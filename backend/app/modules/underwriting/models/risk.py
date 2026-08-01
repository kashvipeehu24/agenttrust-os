from sqlalchemy import Column, Integer, Float, String
from app.database.database import Base


class RiskAnalysis(Base):
    __tablename__ = "risk_analysis"

    id = Column(Integer, primary_key=True, index=True)

    agent_id = Column(String, nullable=False)

    risk_score = Column(Float, nullable=False)

    risk_level = Column(String, nullable=False)

    explanation = Column(String)
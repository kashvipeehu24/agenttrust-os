from sqlalchemy import Column, Integer, String
from app.database.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)

    agent_id = Column(String, nullable=False)

    recommendation = Column(String)

    reason = Column(String)
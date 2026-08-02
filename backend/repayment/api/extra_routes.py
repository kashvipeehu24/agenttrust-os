from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from typing import List, Dict
from fastapi import APIRouter
from pydantic import BaseModel

# Forecast Router
forecast_router = APIRouter(prefix="/forecast", tags=["Forecast"])

class ForecastSummary(BaseModel):
    expectedRevenue: float
    expectedRepayment: float
    expectedBalance: float
    confidence: float

class ForecastPoint(BaseModel):
    month: str
    projectedRevenue: float
    projectedRepayment: float
    projectedBalance: float

@forecast_router.get("/{wallet_id}/summary", response_model=ForecastSummary)
async def get_forecast_summary(wallet_id: str):
    return ForecastSummary(
        expectedRevenue=1200000.0,
        expectedRepayment=50000.0,
        expectedBalance=1150000.0,
        confidence=94.5
    )

@forecast_router.get("/{wallet_id}", response_model=List[ForecastPoint])
async def get_forecast_history(wallet_id: str):
    return [
        ForecastPoint(month="Aug", projectedRevenue=150000.0, projectedRepayment=5000.0, projectedBalance=145000.0),
        ForecastPoint(month="Sep", projectedRevenue=160000.0, projectedRepayment=5000.0, projectedBalance=300000.0),
        ForecastPoint(month="Oct", projectedRevenue=170000.0, projectedRepayment=5000.0, projectedBalance=465000.0),
        ForecastPoint(month="Nov", projectedRevenue=180000.0, projectedRepayment=5000.0, projectedBalance=640000.0),
    ]

# AI Suggestions Router
ai_suggestions_router = APIRouter(prefix="/ai-suggestions", tags=["AISuggestions"])

class AISuggestionSummary(BaseModel):
    totalSuggestions: int
    highPriority: int
    mediumPriority: int
    lowPriority: int

class AISuggestion(BaseModel):
    id: str
    title: str
    description: str
    priority: str

@ai_suggestions_router.get("/{wallet_id}/summary", response_model=AISuggestionSummary)
async def get_ai_suggestions_summary(wallet_id: str):
    return AISuggestionSummary(
        totalSuggestions=3,
        highPriority=1,
        mediumPriority=1,
        lowPriority=1
    )

@ai_suggestions_router.get("/{wallet_id}", response_model=List[AISuggestion])
async def get_ai_suggestions(wallet_id: str):
    return [
        AISuggestion(
            id="sug_1",
            title="Optimize Repayment Softness",
            description="Automated schedule can be softened based on projected Sep revenue delays.",
            priority="high"
        ),
        AISuggestion(
            id="sug_2",
            title="Accelerate Payment",
            description="Consider paying early to decrease the outstanding loan balance interest.",
            priority="medium"
        ),
        AISuggestion(
            id="sug_3",
            title="Maintain Minimum Balance",
            description="Ensure wallet has at least $10,000 for upcoming milestone charges.",
            priority="low"
        )
    ]

# Cash Flow Router
cashflow_router = APIRouter(prefix="/cashflow", tags=["CashFlow"])

class CashFlowSummary(BaseModel):
    totalIncome: float
    totalExpense: float
    netCashFlow: float
    trend: str

class CashFlowPoint(BaseModel):
    month: str
    income: float
    expense: float
    balance: float

@cashflow_router.get("/{wallet_id}/summary", response_model=CashFlowSummary)
async def get_cashflow_summary(wallet_id: str):
    return CashFlowSummary(
        totalIncome=150000.0,
        totalExpense=25000.0,
        netCashFlow=125000.0,
        trend="upward"
    )

@cashflow_router.get("/{wallet_id}/history", response_model=List[CashFlowPoint])
async def get_cashflow_history(wallet_id: str):
    return [
        CashFlowPoint(month="May", income=40000.0, expense=5000.0, balance=35000.0),
        CashFlowPoint(month="Jun", income=50000.0, expense=10000.0, balance=75000.0),
        CashFlowPoint(month="Jul", income=60000.0, expense=10000.0, balance=125000.0),
    ]

# Revenue Router
revenue_router = APIRouter(prefix="/revenue", tags=["Revenue"])

class RevenueSummaryResponse(BaseModel):
    user_id: str
    wallet_id: str
    revenueEarned: float
    pendingRevenue: float
    totalEarnings: float
    revenueSource: str
    revenueTimeline: List[dict]

class RevenueEntryResponse(BaseModel):
    id: str
    source: str
    label: str
    amount: float
    status: str
    date: str

@revenue_router.get("/{wallet_id}/summary", response_model=RevenueSummaryResponse)
async def get_revenue_summary(wallet_id: str):
    return RevenueSummaryResponse(
        user_id="user_demo_1",
        wallet_id=wallet_id,
        revenueEarned=120000.0,
        pendingRevenue=10000.0,
        totalEarnings=130000.0,
        revenueSource="arbitrage_model",
        revenueTimeline=[
            {"label": "May", "value": 30000.0},
            {"label": "Jun", "value": 40000.0},
            {"label": "Jul", "value": 50000.0}
        ]
    )

@revenue_router.get("/{wallet_id}/entries", response_model=List[RevenueEntryResponse])
async def get_revenue_entries(wallet_id: str):
    return [
        RevenueEntryResponse(
            id="rev_1",
            source="agent_contracts",
            label="Trading Arbitrage Profit",
            amount=80000.0,
            status="earned",
            date="2026-08-01"
        ),
        RevenueEntryResponse(
            id="rev_2",
            source="escrow_fees",
            label="Escrow Release Fee",
            amount=50000.0,
            status="pending",
            date="2026-08-02"
        )
    ]

from .constants import (
    LOW_RISK_THRESHOLD,
    MEDIUM_RISK_THRESHOLD,
    HIGH_RISK_THRESHOLD,
)


def get_risk_level(score: float) -> str:
    if score <= LOW_RISK_THRESHOLD:
        return "LOW"

    if score <= MEDIUM_RISK_THRESHOLD:
        return "MEDIUM"

    if score <= HIGH_RISK_THRESHOLD:
        return "HIGH"

    return "CRITICAL"


def normalize_score(score: float) -> float:
    return max(0.0, min(100.0, round(score, 2)))
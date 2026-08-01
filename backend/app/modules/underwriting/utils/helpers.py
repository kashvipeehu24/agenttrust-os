from datetime import datetime
import uuid


def generate_loan_id() -> str:
    return f"LOAN-{uuid.uuid4().hex[:10].upper()}"


def generate_application_id() -> str:
    return f"APP-{uuid.uuid4().hex[:10].upper()}"


def current_timestamp():
    return datetime.utcnow()
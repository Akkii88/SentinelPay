import random
import time
import uuid
from datetime import datetime
import numpy as np

# Constants for simulation
LOCATIONS = [
    "New York, US", "London, UK", "Tokyo, JP", "San Francisco, US", 
    "Paris, FR", "Berlin, DE", "Sydney, AU", "Singapore, SG",
    "Toronto, CA", "Mumbai, IN", "Sao Paulo, BR", "Lagos, NG"
]

MERCHANTS = [
    "Amazon", "Uber", "Starbucks", "Apple Store", "Walmart", 
    "Target", "Netflix", "Spotify", "Delta Airlines", "Hilton Hotels",
    "Local Coffee Shop", "Gas Station", "Electronics Store"
]

FRAUD_SCENARIOS = [
    "High Amount, New Location",
    "Velocity: Multiple txns in short time",
    "High Risk Merchant",
    "Device Mismatch",
    "Suspicious Time of Day"
]

class TransactionGenerator:
    def __init__(self):
        self.cards = [f"4{random.randint(1000,9999)}-{random.randint(1000,9999)}-{random.randint(1000,9999)}-{random.randint(1000,9999)}" for _ in range(50)]
    
    def generate_transaction(self):
        is_fraud = random.random() < 0.05  # 5% fraud rate
        
        card = random.choice(self.cards)
        amount = round(random.uniform(5.00, 2000.00), 2)
        location = random.choice(LOCATIONS)
        merchant = random.choice(MERCHANTS)
        
        risk_score = random.randint(1, 100)
        
        if is_fraud:
            risk_score = random.randint(85, 99)
            amount = round(random.uniform(500.00, 5000.00), 2)
            scenario = random.choice(FRAUD_SCENARIOS)
            status = "Blocked" if risk_score > 90 else "Flagged"
            explanation = f"Flagged due to {scenario}."
        else:
            risk_score = random.randint(1, 40)
            status = "Approved"
            scenario = "Normal Transaction"
            explanation = "Transaction fits normal behavior profile."
            
            # Occasional medium risk
            if random.random() < 0.1:
                risk_score = random.randint(41, 70)
                status = "Flagged"
                explanation = "Unusual pattern detected, but within tolerance."

        return {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "card_number": f"****-****-****-{card.split('-')[-1]}",
            "amount": amount,
            "currency": "USD",
            "location": location,
            "merchant": merchant,
            "risk_score": risk_score,
            "status": status,
            "scenario": scenario,
            "explanation": explanation,
            "latency_ms": random.randint(50, 450)
        }

generator = TransactionGenerator()

import pandas as pd
import time
import uuid
import random
from datetime import datetime
import os
from ml_engine import MLEngine

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "creditcard.csv")

# Geographic locations to map to real data (since dataset is anonymized)
LOCATIONS = [
    "New York, US", "London, UK", "Tokyo, JP", "San Francisco, US", 
    "Paris, FR", "Berlin, DE", "Sydney, AU", "Singapore, SG",
    "Toronto, CA", "Mumbai, IN", "Sao Paulo, BR", "Lagos, NG"
]

MERCHANTS = [
    "Amazon", "Uber", "Starbucks", "Apple Store", "Walmart", 
    "Target", "Netflix", "Spotify", "Delta Airlines", "Hilton Hotels"
]

class DataStream:
    def __init__(self, ml_engine: MLEngine):
        self.ml_engine = ml_engine
        self.test_data = None
        self.iterator = None
        self._load_test_data()
        
    def _load_test_data(self):
        try:
            df = pd.read_csv(DATA_PATH)
            # Use the last 20% to simulate "future" / live stream
            split_idx = int(len(df) * 0.8)
            self.test_data = df.iloc[split_idx:].reset_index(drop=True)
            self.iterator = self.test_data.iterrows()
            print(f"Data Stream loaded with {len(self.test_data)} live transactions.")
        except Exception as e:
            print(f"Error loading data stream: {e}")
            self.test_data = pd.DataFrame()

    def next_transaction(self):
        try:
            # Get next row
            idx, row = next(self.iterator)
        except StopIteration:
            # Restart stream if finished
            self.iterator = self.test_data.iterrows()
            idx, row = next(self.iterator)
            
        # Extract Features for Model
        features = row.drop(['Time', 'Class'], errors='ignore').to_dict()
        
        # Get Real AI Prediction
        prob = self.ml_engine.predict_one(features)
        risk_score = int(prob * 100)
        
        # Heuristic Status
        if risk_score > 85:
            status = "Blocked"
            scenario = "AI Confidence > 85%"
            explanation = "Model detected high-probability fraud patterns (V-features outlier)."
        elif risk_score > 50:
            status = "Flagged"
            scenario = "Suspicious Activity"
            explanation = "Transaction flagged for manual review due to elevated risk score."
        else:
            status = "Approved"
            scenario = "Normal"
            explanation = "Transaction fits trusted profiles."

        # Enhance with simulated metadata (since dataset is anonymized)
        return {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "card_number": f"4{random.randint(1000,9999)}-****-****-{random.randint(1000,9999)}",
            "amount": float(row['Amount']),
            "currency": "USD",
            "location": random.choice(LOCATIONS),
            "merchant": random.choice(MERCHANTS),
            "risk_score": risk_score,
            "status": status,
            "scenario": scenario,
            "explanation": explanation,
            "latency_ms": random.randint(50, 450)
        }

# Initializer pattern will be used in main.py

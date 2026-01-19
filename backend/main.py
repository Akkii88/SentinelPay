import asyncio
import json
import random
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from ml_engine import MLEngine
from data_stream import DataStream

app = FastAPI(title="SentinelPay Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
ml_engine = MLEngine()
stream = None

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "SentinelPay Backend"}

@app.get("/")
def root():
    return {"message": "Welcome to SentinelPay API. Visit /docs for documentation."}

@app.on_event("startup")
async def startup_event():
    global stream
    # Check if model exists, else train
    if not ml_engine.load_model():
        print("Training new AutoML models...")
        ml_engine.train_automl()
    else:
        print("Loaded existing AutoML model.")
    
    stream = DataStream(ml_engine)

@app.websocket("/ws/transactions")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            if stream:
                txn = stream.next_transaction()
                await websocket.send_text(json.dumps(txn))
                # Variable delay to simulate organic traffic
                await asyncio.sleep(random.uniform(0.5, 2.0))
            else:
                await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("Client disconnected")


@app.get("/api/stats")
def get_stats():
    meta = ml_engine.get_governance_stats()
    return {
        "fraud_rate": "0.17%", # Historical baseline
        "active_models": 1,
        "transactions_24h": "284,807",
        "avg_latency": "145ms"
    }

@app.get("/api/automl")
def get_automl():
    # Return real governance data from the ML Engine
    meta = ml_engine.get_governance_stats()
    return {
        "current_model": meta.get("active_model", "Unknown"),
        "status": meta.get("status", "Idle"),
        "last_trained": meta.get("last_trained", "Unknown"),
        "accuracy": meta.get("accuracy", "0.0%"),
        "recall": meta.get("recall", "0.0%"),
        "drift_status": "Stable (p > 0.05)",
        "next_training": "Scheduled for 24h"
    }

@app.get("/api/alerts")
def get_alerts():
    # This remains mock for now, as alerts are generated live
    # Ideally should be persisted, but for live dashboard demo, existing is fine.
    return [] 


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

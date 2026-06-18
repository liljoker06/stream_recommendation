from fastapi import FastAPI
from training.trainer import train_model
from services.hdfs_reader import read_text_from_minio
import threading
import time
import json
from contextlib import asynccontextmanager

GOLD_BUCKET = "gold"
MODEL_KEY = "models/model_current.json"


def training_loop():
    print("🚀 Background training loop started", flush=True)
    while True:
        try:
            print("🔁 Training started", flush=True)
            train_model()
            print("✅ Training finished", flush=True)
        except Exception as e:
            print("❌ Training error:", e, flush=True)
        time.sleep(30)


@asynccontextmanager
async def lifespan(app: FastAPI):
    thread = threading.Thread(target=training_loop, daemon=True)
    thread.start()
    yield


app = FastAPI(lifespan=lifespan)


# =========================
# ROUTE IA (SAFE)
# =========================
@app.get("/recommend/{user_id}")
def recommend(user_id: str, limit: int = 20):
    try:
        raw = read_text_from_minio(GOLD_BUCKET, MODEL_KEY)
        model = json.loads(raw)

        if user_id not in model:
            return {
                "success": True,
                "strategy": "ai",
                "count": 0,
                "recommendations": [],
            }

        scores = model[user_id]
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

        return {
            "success": True,
            "strategy": "ai",
            "user_id": user_id,
            "count": len(ranked[:limit]),
            "recommendations": [k for k, _ in ranked[:limit]],
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
        }

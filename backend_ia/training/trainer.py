from services.hdfs_reader import read_csv_from_minio
from services.hdfs_writer import write_text_to_minio
from collections import defaultdict
import json

SILVER_BUCKET = "silver"
EVENTS_PREFIX = "events"

GOLD_BUCKET = "gold"
MODEL_KEY = "models/model_current.json"

EVENT_WEIGHTS = {
    "view_film_page": 1.0,
    "open_trailer": 2.0,
    "duration_seconds": 3.0,
    "view_category": 0.5,
}


def train_model():
    print("🔁 Training started")

    rows = read_csv_from_minio(SILVER_BUCKET, EVENTS_PREFIX)
    user_profiles = defaultdict(lambda: defaultdict(float))

    for row in rows:
        user_id = row.get("user_id")
        event_type = row.get("event_type")

        if not user_id or not event_type:
            continue

        base_score = EVENT_WEIGHTS.get(event_type, 0.3)

        duration_bonus = 0
        if event_type == "duration_seconds":
            try:
                duration = float(row.get("duration_seconds", 0))
                duration_bonus = min(duration / 60, 5)
            except Exception:
                pass

        score = base_score + duration_bonus

        tags = row.get("tags", "")
        if not tags:
            continue

        for tag in tags.split(","):
            tag = tag.strip()
            if tag:
                user_profiles[user_id][tag] += score

    write_text_to_minio(
        GOLD_BUCKET,
        MODEL_KEY,
        json.dumps({u: dict(v) for u, v in user_profiles.items()}),
    )

    print("✅ Training finished")

import json
from collections import defaultdict

class RecommenderModel:
    def __init__(self):
        # user_id -> tag -> score
        self.user_profiles = defaultdict(lambda: defaultdict(float))

    def train(self, rows):
        """
        rows: liste de dicts venant de HDFS (CSV Kafka)
        """
        EVENT_WEIGHTS = {
            "view_film_page": 1.0,
            "open_trailer": 2.0,
            "duration_seconds": 3.0,
            "view_category": 0.5
        }

        for row in rows:
            user_id = row.get("user_id")
            event_type = row.get("event_type")
            tags = row.get("tags", "")

            if not user_id or not tags:
                continue

            base_score = EVENT_WEIGHTS.get(event_type, 0.3)

            # bonus durée réelle
            bonus = 0
            if event_type == "duration_seconds":
                try:
                    duration = float(row.get("duration_seconds", 0))
                    bonus = min(duration / 60, 5)
                except:
                    pass

            score = base_score + bonus

            for tag in tags.split(","):
                tag = tag.strip()
                if tag:
                    self.user_profiles[user_id][tag] += score

    def recommend(self, user_id, limit=10):
        """
        Retourne une liste de TAGS préférés
        """
        if user_id not in self.user_profiles:
            return []

        sorted_tags = sorted(
            self.user_profiles[user_id].items(),
            key=lambda x: x[1],
            reverse=True
        )

        return [tag for tag, _ in sorted_tags[:limit]]

    def serialize(self):
        return json.dumps(
            {u: dict(v) for u, v in self.user_profiles.items()}
        )

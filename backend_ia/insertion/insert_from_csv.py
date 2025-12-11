import csv
import os
import psycopg2
from psycopg2.extras import Json

# -----------------------------
#  Résolution correcte du CSV
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.normpath(os.path.join(BASE_DIR, "..", "insertion", "data", "films_tmdb_multi_genres.csv"))

print("📌 Fichier CSV utilisé :", CSV_PATH)


def to_int(value):
    if value in (None, "", "None"):
        return None
    try:
        return int(float(value))
    except ValueError:
        return None


def to_float(value):
    if value in (None, "", "None"):
        return None
    try:
        return float(value)
    except ValueError:
        return None


def load_movies_from_csv():
    movies = []
    with open(CSV_PATH, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            movies.append(row)

    print(f"📥 {len(movies)} films chargés depuis CSV")
    return movies


def insert_movies(movies):
    conn = psycopg2.connect(
        host="postgres",
        port=5432,
        database="recommendation_db",
        user="admin",
        password="admin123",
    )
    cur = conn.cursor()

    insert_sql = """
    INSERT INTO contents (
        tmdb_id,
        title,
        description,
        type,
        category,
        tags,
        duration,
        creator_id,
        upload_date,
        language,
        popularity_score,
        metadata
    )
    VALUES (
        %(tmdb_id)s,
        %(title)s,
        %(description)s,
        %(type)s,
        %(category)s,
        %(tags)s,
        %(duration)s,
        %(creator_id)s,
        %(upload_date)s,
        %(language)s,
        %(popularity_score)s,
        %(metadata)s
    )
    ON CONFLICT (tmdb_id) DO NOTHING
    RETURNING content_id;
    """

    for movie in movies:
        tmdb_id = to_int(movie.get("id"))

        metadata = {
            "tmdb_id": tmdb_id,
            "budget": to_int(movie.get("budget")),
            "revenue": to_int(movie.get("revenu")),
            "vote_average": to_float(movie.get("note")),
            "poster_url": movie.get("poster_url"),
            "backdrop_url": movie.get("backdrop_url"),
            "homepage": movie.get("site_officiel"),
            "raw_genres": movie.get("genres"),
        }

        data = {
            "tmdb_id": tmdb_id,   # 🔥 OBLIGATOIRE !
            "title": movie.get("titre"),
            "description": movie.get("synopsis"),
            "type": "movie",
            "category": movie.get("genre_principal"),
            "tags": movie.get("genres"),
            "duration": to_int(movie.get("duree")),
            "creator_id": None,
            "upload_date": movie.get("date") or None,
            "language": movie.get("langue_originale"),
            "popularity_score": to_float(movie.get("popularite")),
            "metadata": Json(metadata),
        }

        cur.execute(insert_sql, data)

        result = cur.fetchone()
        if result:
            print(f"✔️ Ajouté → {data['title']} (ID : {result[0]})")
        else:
            print(f"➖ Déjà présent (tmdb_id={tmdb_id}) : {data['title']}")

    conn.commit()
    cur.close()
    conn.close()

    print("🎉 Import terminé avec succès !")


if __name__ == "__main__":
    movies = load_movies_from_csv()
    insert_movies(movies)

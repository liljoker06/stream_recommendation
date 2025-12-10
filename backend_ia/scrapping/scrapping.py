import requests
import time
import os
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType
import shutil

# ==============================
# 🔑 Clé TMDb et URLs
# ==============================
API_KEY = "d399fc794ea447caf71ba4f4f940023e"
BASE_URL = "https://api.themoviedb.org/3"
POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"
BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280"

MAX_PAGES = 10  # pages par genre
SLEEP_TIME = 0.2  # pause entre chaque requête

# ==============================
# 🔹 Liste des genres populaires TMDb
# ==============================
GENRES = {
    28: "Action",
    35: "Comédie",
    18: "Drame",
    27: "Horreur",
    10749: "Romance",
    878: "Science-Fiction",
    12: "Aventure"
}

# ==============================
# 🔥 Spark
# ==============================
spark = SparkSession.builder.appName("TMDb Multi-Genres").getOrCreate()

all_movies = []
print("Récupération des films par genre...\n")

# ==============================
# 🔹 Récupération par genre et pages
# ==============================
for genre_id, genre_name in GENRES.items():
    print(f"--- Genre: {genre_name} ---")
    for page in range(1, MAX_PAGES + 1):
        url = f"{BASE_URL}/discover/movie"
        params = {
            "api_key": API_KEY,
            "language": "fr-FR",
            "sort_by": "popularity.desc",
            "with_genres": str(genre_id),
            "page": page
        }

        data = requests.get(url, params=params).json()
        if "results" not in data or not data["results"]:
            break

        for movie in data["results"]:
            movie_id = movie["id"]
            # Vérifie si le film a déjà été ajouté (éviter doublons)
            if any(m["id"] == str(movie_id) for m in all_movies):
                continue

            detail_data = requests.get(f"{BASE_URL}/movie/{movie_id}", params={"api_key": API_KEY, "language": "fr-FR"}).json()
            if detail_data.get("status_code") == 34:
                continue

            poster_url = POSTER_BASE_URL + detail_data["poster_path"] if detail_data.get("poster_path") else ""
            backdrop_url = BACKDROP_BASE_URL + detail_data["backdrop_path"] if detail_data.get("backdrop_path") else ""

            all_movies.append({
                "id": str(detail_data.get("id")),
                "titre": detail_data.get("title"),
                "date": detail_data.get("release_date"),
                "popularite": str(detail_data.get("popularity")),
                "note": str(detail_data.get("vote_average")),
                "synopsis": detail_data.get("overview"),
                "budget": str(detail_data.get("budget")),
                "revenu": str(detail_data.get("revenue")),
                "duree": str(detail_data.get("runtime")),
                "genres": ", ".join([g["name"] for g in detail_data.get("genres", [])]),
                "langue_originale": detail_data.get("original_language"),
                "site_officiel": detail_data.get("homepage"),
                "poster_url": poster_url,
                "backdrop_url": backdrop_url,
                "genre_principal": genre_name
            })

            print(f"✔ {detail_data.get('title')} récupéré ({genre_name})")
            time.sleep(SLEEP_TIME)

# ==============================
# 🔹 Création DataFrame Spark
# ==============================
schema = StructType([StructField(k, StringType(), True) for k in all_movies[0].keys()])
df = spark.createDataFrame(all_movies, schema=schema)

# ==============================
# 💾 Sauvegarde CSV unique
# ==============================
temp_dir = "films_tmdb_temp"
final_csv = "films_tmdb_multi_genres.csv"

df.coalesce(1).write.mode("overwrite").option("header", "true").csv(temp_dir)

# Récupérer le fichier CSV et renommer
for filename in os.listdir(temp_dir):
    if filename.startswith("part-") and filename.endswith(".csv"):
        shutil.move(os.path.join(temp_dir, filename), final_csv)
        break
shutil.rmtree(temp_dir)

print(f"\n🎉 Terminé ! Tous les films multi-genres sont enregistrés dans : {final_csv}")

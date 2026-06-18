# 🚀 Stream Recommendation Platform

Plateforme complète de recommandation **temps réel + batch** basée sur un pipeline Big Data.

Ce README décrit **l'architecture réelle et finale**, conforme à ce qui a été implémenté :

* streaming d'événements depuis le frontend
* ingestion Kafka
* traitement Spark
* stockage MinIO (architecture Medallion Silver / Gold)
* entraînement IA à partir des CSV
* exposition des recommandations via Node.js

---

## 🧠 Architecture Globale (Réelle)

```
Frontend (Web / Mobile)
        │
        ▼
Backend Node.js
(API + Producer Kafka)
        │
        ▼
Kafka (events)                          ← Bronze (raw, éphémère)
        │
        ▼
Spark Streaming
(filtrage + enrichissement)
        │
        ▼
MinIO — bucket: silver                  ← Silver (CSV événements traités)
/events/*.csv
        │
        ▼
Backend IA (FastAPI)
(entraînement + modèle)
        │
        ▼
MinIO — bucket: gold                    ← Gold (modèle consommable)
/models/model_current.json
        │
        ▼
Backend Node.js
(API recommandations)
        │
        ▼
Frontend
```

---

## 🧩 Rôle de chaque composant

### Frontend

* Envoie des **événements utilisateur** (navigation, lecture, interactions)
* Consomme l'API de recommandations

### Backend Node.js

* API principale
* Authentification / contenus
* **Producer Kafka** : envoie les événements utilisateur
* Consomme l'API IA pour obtenir les genres pondérés
* Applique la logique de recommandation SQL

### Kafka

* Bus d'événements temps réel
* Reçoit tous les events provenant du frontend via Node.js

### Spark Streaming

* Consomme Kafka
* Filtre et normalise les événements
* Écrit les données sous forme de **CSV** dans MinIO (bucket `silver`)

### MinIO

* Stockage objet local compatible S3
* Remplace Hadoop HDFS
* Deux buckets :

  | Bucket   | Couche | Contenu                          |
  | -------- | ------ | -------------------------------- |
  | `silver` | Silver | CSV d'événements traités par Spark |
  | `gold`   | Gold   | Modèle IA entraîné (JSON)        |

* Console web accessible sur `http://localhost:9101`

### Backend IA (FastAPI)

* Lit les CSV depuis MinIO (`silver/events/`)
* Entraîne un modèle simple basé sur **pondération de genres**
* Sauvegarde le modèle dans MinIO (`gold/models/model_current.json`)
* Expose une API de recommandation par utilisateur

---

## 📁 Organisation MinIO

```
bucket: silver
  └── events/
        └── part-*.csv          ← écrits par Spark Streaming

bucket: gold
  └── models/
        └── model_current.json  ← écrit par le Backend IA
```

### Exemple de modèle IA

```json
{
  "user_id": {
    "Action": 12.5,
    "Horreur": 31.0,
    "Thriller": 19.7,
    "Mystère": 23.8
  }
}
```

---

## 🤖 API Backend IA

### GET /recommend/{user_id}

Retourne les genres préférés **ordonnés** pour un utilisateur.

#### Exemple de réponse

```json
{
  "success": true,
  "strategy": "ai",
  "user_id": "uuid",
  "count": 12,
  "recommendations": [
    "Horreur",
    "Mystère",
    "Action",
    "Thriller",
    "Fantastique",
    "Science-Fiction"
  ]
}
```

⚠️ **Important** :

* L'ordre = importance
* Le poids est reconstruit côté Node.js

---

## 🎯 Logique de recommandation (Node.js)

1. Appel API IA
2. Génération des poids selon l'ordre :

| Position | Poids |
| -------- | ----- |
| 1        | 7     |
| 2        | 6     |
| 3        | 5     |
| ...      | ...   |

3. Matching avec :

   * `tags`
   * `category`
4. Calcul du score final
5. Tri décroissant
6. Fallback popularité si IA vide

---

## 📊 Événements utilisateurs (Streaming)

| Event            | Signification IA   |
| ---------------- | ------------------ |
| view_film_page   | intérêt léger      |
| view_category    | goût général       |
| open_trailer     | intérêt élevé      |
| play             | engagement fort    |
| duration_seconds | importance du film |
| repeat_view      | film très apprécié |

Ces événements sont :

* envoyés par Node.js
* streamés via Kafka
* traités par Spark
* stockés en CSV dans MinIO (bucket `silver`)

---

## 🧪 Insertion manuelle des données (étape cruciale)

Nécessaire pour :

* tests
* entraînement initial
* debug du pipeline

### Windows (obligatoire)

```bash
setx TEMP C:\TempPSQL
setx TMP C:\TempPSQL
```

### Lancer un conteneur Python

```bash
docker run -it --rm \
  --network=bigdata-net \
  -v C:\stream_recommendation\backend_ia:/app \
  python:3.11 bash
```

### Installer dépendances

```bash
cd /app
pip install psycopg2-binary
```

### Insérer les données

```bash
python insertion/insert_from_csv.py
```

---

## ▶️ Lancement des stacks

### Infrastructure Big Data

```bash
docker compose up -d
```

> Démarre : MinIO, Kafka, Spark, PostgreSQL

### Stack Applicative

```bash
docker compose -f docker-compose.dev.yml up -d
```

> Démarre : Backend IA, Backend Node.js, Frontend

### Interfaces web

| Service        | URL                      | Identifiants              |
| -------------- | ------------------------ | ------------------------- |
| MinIO Console  | http://localhost:9101    | minioadmin / minioadmin   |
| Kafka UI       | http://localhost:8081    | —                         |
| Spark Master   | http://localhost:8080    | —                         |
| pgAdmin        | http://localhost:5050    | admin@gmail.com / admin123 |

---

## 🎯 État actuel du projet

* Pipeline streaming fonctionnel
* IA basée sur comportement réel
* Stockage objet MinIO (Medallion Silver / Gold)
* Pas de table `events` en PostgreSQL
* Tout passe par Kafka → Spark → MinIO

---

## 🚧 Évolutions possibles

* Fenêtres temporelles Spark
* Modèle IA plus avancé
* Pondération dynamique
* Monitoring Kafka / Spark
* Ajout couche Bronze dans MinIO (raw Kafka events)

---

Plateforme pensée **comme une vraie stack Big Data**, pédagogique mais réaliste.

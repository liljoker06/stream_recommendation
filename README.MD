# 🚀 Stream Recommendation Platform

Plateforme complète de recommandation **temps réel + batch** basée sur un pipeline Big Data.

Ce README décrit **l’architecture réelle et finale**, conforme à ce qui a été implémenté :

* streaming d’événements depuis le frontend
* ingestion Kafka
* traitement Spark
* stockage HDFS
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
Kafka (events)
        │
        ▼
Spark Streaming
(filtrage + enrichissement)
        │
        ▼
HDFS (CSV événements)
        │
        ▼
Backend IA (FastAPI)
(entrainement + modèle)
        │
        ▼
HDFS (/models/recommender)
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
* Consomme l’API de recommandations

### Backend Node.js

* API principale
* Authentification / contenus
* **Producer Kafka** : envoie les événements utilisateur
* Consomme l’API IA pour obtenir les genres pondérés
* Applique la logique de recommandation SQL

### Kafka

* Bus d’événements temps réel
* Reçoit tous les events provenant du frontend via Node.js

### Spark Streaming

* Consomme Kafka
* Filtre et normalise les événements
* Écrit les données sous forme de **CSV** dans HDFS

### Hadoop HDFS

* Stockage long terme
* Contient :

  * CSV d’événements utilisateurs
  * modèles IA entraînés

### Backend IA (FastAPI)

* Lit les CSV depuis HDFS
* Entraîne un modèle simple basé sur **pondération de genres**
* Sauvegarde le modèle dans HDFS
* Expose une API de recommandation par utilisateur

---

## 📁 Organisation HDFS

```
/models
  └── recommender
      └── model_current.json

/data
  └── events
      └── *.csv
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

* L’ordre = importance
* Le poids est reconstruit côté Node.js

---

## 🎯 Logique de recommandation (Node.js)

1. Appel API IA
2. Génération des poids selon l’ordre :

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
* stockés en CSV dans HDFS

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

### Stack Applicative

```bash
docker compose -f docker-compose.dev.yml up -d
```

---

## 🎯 État actuel du projet

* Pipeline streaming fonctionnel
* IA basée sur comportement réel
* Pas de table `events` en PostgreSQL
* Tout passe par Kafka → Spark → HDFS

---

## 🚧 Évolutions possibles

* Fenêtres temporelles Spark
* Modèle IA plus avancé
* Pondération dynamique
* Monitoring Kafka / Spark

---

Plateforme pensée **comme une vraie stack Big Data**, pédagogique mais réaliste.

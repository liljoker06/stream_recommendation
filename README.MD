# 🚀 Stream Recommendation Platform — Guide de Lancement

### 🧩 Architecture Globale du Projet

Voici une vue simplifiée de l'architecture complète :

```
             Frontend Web / Mobile
                      │
            ┌─────────┴──────────┐
            │                    │
        Backend Node         Backend IA
            │                    │
       PostgreSQL           HBase (hot data)
            │                    │
            └──────────┬─────────┘
                       │
                     Spark
                       │
                   Kafka Streams
                       │
                    Hadoop (HDFS)
                  (storage long terme)
```

### 📝 Explication

* **Frontend (Web / Mobile)** : Interface utilisée par les utilisateurs.
* **Backend Node.js** : Gère les utilisateurs, contenus, authentification, stockés dans PostgreSQL.
* **Backend IA (FastAPI)** : Génère les recommandations et utilise HBase pour lire les interactions massives.
* **PostgreSQL** : Base structurée (users, contenus, métadonnées). Tables créées automatiquement.
* **HBase** : Base distribuée pour interactions, sessions et recommandations. Tables créées **manuellement**.
* **Kafka Streams** : Ingestion en temps réel des événements.
* **Spark** : Traitement batch + streaming et préparation des données.
* **Hadoop HDFS** : Archivage long terme des données volumineuses.

— Guide de Lancement

## ⚙️ Architecture de Lancement

> Le projet utilise **deux orchestrations distinctes** :

| Fichier                  | Stack           | Conteneurs                            | Rôle                                         |
| ------------------------ | --------------- | ------------------------------------- | -------------------------------------------- |
| `docker-compose.yml`     | Big Data Layer  | Hadoop, Kafka, Spark, Kafka UI, HBase | Infrastructure streaming & storage distribué |
| `docker-compose.dev.yml` | App & Dev Layer | Backend IA, Backend Node, Frontend    | Environnement applicatif (API + UI)          |

Chaque stack doit être lancée **séparément**, pour un contrôle clair et une meilleure stabilité.

---

## 🗂️ 1. Démarrage de l'Infrastructure Big Data

```bash
docker compose up -d
```

### 🔍 Services Lancés

* Hadoop Namenode / Datanodes
* Hadoop ResourceManager & NodeManager
* Spark Master & Worker
* Kafka & Kafka UI
* **HBase (Master + RegionServer)**

### 🌐 Interfaces d'Administration

| Service         | URL                                              |
| --------------- | ------------------------------------------------ |
| Namenode        | [http://localhost:9870](http://localhost:9870)   |
| ResourceManager | [http://localhost:8088](http://localhost:8088)   |
| Spark Master UI | [http://localhost:8080](http://localhost:8080)   |
| Kafka UI        | [http://localhost:8081](http://localhost:8081)   |
| HBase Master UI | [http://localhost:16010](http://localhost:16010) |

---

## 🗄️ 2. Initialisation des Bases de Données

### ✅ PostgreSQL — Automatique

La base Postgres est initialisée **automatiquement** via le fichier :

```
/db/init.sql
```

Ce script crée par défaut :

* `users`
* `contents`
* `trailers`
* `streaming_links`

Aucune manipulation supplémentaire n'est requise.

---

## 🏗️ HBase — Initialisation Manuelle

HBase **ne supporte pas l'initialisation automatique via Docker Entrypoint**, il faut donc créer les tables **manuellement** lors de la première installation.

### 👉 Étapes pour créer les tables HBase

#### 1. Ouvrir un terminal dans HBase Master

```bash
docker exec -it hbase-master bash
```

#### 2. Ouvrir le shell HBase

```bash
hbase shell
```

#### 3. Créer les tables nécessaires

```hbase
create 'interactions', 'data'
create 'recommendations', 'data'
create 'sessions', 'data'
```

#### 4. Vérifier la création des tables

```hbase
list
```

Résultat attendu :

```
TABLE
interactions
recommendations
sessions
3 row(s)
```

✔️ Ces tables seront utilisées par Spark Streaming pour stocker les événements et recommandations.

---

## 💻 3. Lancement de l'Environnement Applicatif

### 📌 Pré-requis locaux (obligatoire)

Avant de lancer Docker, installez les dépendances en local :

```bash
cd backend_node && npm install
cd ../frontend && npm install
```

> ⚠️ Ne pas exécuter `npm run dev` manuellement — Docker s'en charge.

### ▶️ Lancement

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 🔥 Services Dev Lancés

| Service      | Port | Description                |
| ------------ | ---- | -------------------------- |
| backend_ia   | 9000 | API FastAPI (`/docs`)      |
| backend_node | 4000 | API Node.js (hot reload)   |
| frontend     | 5173 | React + Vite (auto-reload) |

### 🌍 URLs

* API IA : [http://localhost:9000/docs](http://localhost:9000/docs)
* Backend Node : [http://localhost:4000](http://localhost:4000)
* Frontend : [http://localhost:5173](http://localhost:5173)

---

## 🛑 Arrêt des Éléments

### ⛔ App Layer uniquement

```bash
docker compose -f docker-compose.dev.yml down
```

### 🔴 Full Shutdown (Big Data + App)

```bash
docker compose down --remove-orphans
```

---

## 🔄 Rebuild Complet

### Dev Layer

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

### Big Data Layer

```bash
docker compose up -d --build
```

---

## 📦 Volumes Docker Utilisés

| Volume             | Rôle                     |
| ------------------ | ------------------------ |
| node-modules-back  | Dépendances Node backend |
| node-modules-front | Dépendances frontend     |
| ia-pyc             | Cache Python             |
| pgdata             | Persistante PostgreSQL   |
| kafka-data         | Stockage Kafka           |

---

## 🧠 Notes Développeur

* Hot reload activé partout (Node, FastAPI, React)
* Pas de `node_modules` local → environnement propre
* Rebuild uniquement si Dockerfile modifié

---

## 🎯 Résultat Final

L’architecture permet :

* Une **infrastructure Big Data robuste** (Kafka / Spark / Hadoop / HBase)
* Une **stack applicative flexible** (React / Node / FastAPI)
* Un développement fluide avec rechargement à chaud

---

## 📌 Prochaines Étapes

* Ajout de Grafana / Prometheus
* Scaling automatique Spark Workers
* Monitoring Kafka + HBase

---

✨ Bon développement sur votre plateforme de recommandation en streaming ! 🚀

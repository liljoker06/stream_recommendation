# 🚀 Stream Recommendation Platform — Guide de Lancement

## 📌 Architecture de lancement

⚠️ Le projet utilise **DEUX `docker-compose` séparés** :

| Fichier                  | Stack    | Conteneurs                           | Rôle                          |
| ------------------------ | -------- | ------------------------------------ | ----------------------------- |
| `docker-compose.yml`     | Big Data | Hadoop + Kafka + Spark + Kafka UI    | Infrastructure Data Streaming |
| `docker-compose.dev.yml` | Dev App  | Backend IA + Backend Node + Frontend | Application & UI              |

Chaque bloc doit être lancé **séparément**.

---

## 🚀 1. Lancer l'infrastructure Big Data

```bash
cd stream_recommendation

docker compose up -d
```

### ✔️ Conteneurs démarrés

* Hadoop Namenode / Datanodes / ResourceManager / NodeManager
* Spark Master & Worker
* Kafka + Kafka UI

### 🔍 Accès UI

| Service         | URL                                            |
| --------------- | ---------------------------------------------- |
| Namenode        | [http://localhost:9870](http://localhost:9870) |
| ResourceManager | [http://localhost:8088](http://localhost:8088) |
| Spark Master UI | [http://localhost:8080](http://localhost:8080) |
| Kafka UI        | [http://localhost:8081](http://localhost:8081) |

---

## 💻 2. Lancer l'environnement Dev (Back & Front)

```bash
docker compose -f docker-compose.dev.yml up -d
```

### ✔️ Conteneurs démarrés

* `backend_ia` (FastAPI)
* `backend_node` (Node.js + Express)
* `frontend` (React + Vite)

### 🌐 URLs d'accès

| Service      | URL                                                      |
| ------------ | -------------------------------------------------------- |
| API IA       | [http://localhost:9000/docs](http://localhost:9000/docs) |
| Backend Node | [http://localhost:4000](http://localhost:4000)           |
| Frontend     | [http://localhost:5173](http://localhost:5173)           |

---

## 🛑 Arrêter l'environnement

### Stopper uniquement l'app

```bash
docker compose -f docker-compose.dev.yml down
```

### Stopper toute l'infra (Big Data + App)

```bash
docker compose down --remove-orphans
```

---

## 🔄 Rebuild (si modification Dockerfile ou deps)

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Pour la stack Big Data :

```bash
docker compose up -d --build
```

---

## 📦 Volumes internes

| Volume               | Utilité                                  |
| -------------------- | ---------------------------------------- |
| `node-modules-back`  | dépendances backend Node isolées Docker  |
| `node-modules-front` | dépendances frontend Vite isolées Docker |
| `ia-pyc`             | cache python                             |

---

## 🧠 Notes importantes

* Le code est synchronisé en **temps réel** via les volumes
* Node_modules et pycache sont **isolés en volumes Docker** → pas de pollutions locales
* Les devs peuvent coder **sans rebuild**, seulement `docker compose up -d`

---

## 🎯 Résultat

Tu développes ton frontend, backend Node & backend IA **en live**, pendant que Kafka, Spark et Hadoop tournent indépendamment.

🧩 L’équipe peut avancer sans toucher à l’infra.


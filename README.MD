# 🚀 Stream Recommendation Platform — Guide de Lancement

## ⚙️ Architecture de Lancement

> Le projet utilise **deux orchestrations distinctes** :

| Fichier                  | Stack           | Conteneurs                         | Rôle                                             |
| ------------------------ | --------------- | ---------------------------------- | ------------------------------------------------ |
| `docker-compose.yml`     | Big Data Layer  | Hadoop, Kafka, Spark, Kafka UI     | Infrastructure de streaming et distribution data |
| `docker-compose.dev.yml` | App & Dev Layer | Backend IA, Backend Node, Frontend | Environnement applicatif (API + UI)              |

Chaque stack doit être lancée **séparément**, afin d'assurer stabilité et contrôle d'exécution.

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

### 🌐 Interfaces d'Administration

| Service         | URL                                            |
| --------------- | ---------------------------------------------- |
| Namenode        | [http://localhost:9870](http://localhost:9870) |
| ResourceManager | [http://localhost:8088](http://localhost:8088) |
| Spark Master UI | [http://localhost:8080](http://localhost:8080) |
| Kafka UI        | [http://localhost:8081](http://localhost:8081) |

---

## 💻 2. Démarrage de l'Environnement de Développement Applicatif

### 📌 Pré-requis avant lancement (obligatoire)

Avant de démarrer Docker, installez les dépendances en local pour éviter les erreurs `MODULE_NOT_FOUND` et permettre l’auto-complétion IDE :

```bash
cd backend_node && npm install
cd ../frontend && npm install
```

> ⚠️ Ne pas lancer `npm run dev` en local → Docker s’en charge.

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 🔥 Stack Dev Active

| Service        | Port | Description                                   |
| -------------- | ---- | --------------------------------------------- |
| `backend_ia`   | 9000 | API FastAPI + Uvicorn (Documentation `/docs`) |
| `backend_node` | 4000 | API Node.js (Hot reload)                      |
| `frontend`     | 5173 | Interface React + Vite (Auto-reload)          |

### 🌍 URLs d'Accès

| Cible        | URL                                                      |
| ------------ | -------------------------------------------------------- |
| API IA Docs  | [http://localhost:9000/docs](http://localhost:9000/docs) |
| Backend Node | [http://localhost:4000](http://localhost:4000)           |
| Frontend UI  | [http://localhost:5173](http://localhost:5173)           |

---

## 🛑 Arrêt des Éléments

### ⛔ Arrêt uniquement de l'App Layer

```bash
docker compose -f docker-compose.dev.yml down
```

### 🔴 Arrêt complet (Infrastructure + Application)

```bash
docker compose down --remove-orphans
```

---

## 🔄 Rebuild Complet (si modification Dockerfile ou dépendances)

### Dev Layer uniquement

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

### Big Data Layer

```bash
docker compose up -d --build
```

---

## 📦 Gestion des Volumes Internes

| Volume               | Rôle                                            |
| -------------------- | ----------------------------------------------- |
| `node-modules-back`  | Dépendances backend Node isolées (pas en local) |
| `node-modules-front` | Dépendances frontend Vite isolées               |
| `ia-pyc`             | Cache Python géré par Docker                    |

➡️ Avantage : aucun `node_modules` ou `__pycache__` ne pollue votre arborescence locale.

---

## 🧠 Mode Développement — Notes Importantes

* Les sources `backend_node`, `backend_ia` et `frontend` sont montées en **volumes live-sync**.
* **Hot reload** automatique via `nodemon`, `uvicorn --reload`, `vite`.
* Le `build` n'est requis **que si vous modifiez un Dockerfile** ou des dépendances majeures.

✔️ **Tu codes, tu sauvegardes → tout se met à jour en live.**

---

## 🎯 Résultat Final

Grâce à cette double orchestration maîtrisée :

* L’infrastructure Big Data tourne indépendamment et en continu.
* L’application (API + UI) reste agile, modulaire et instantanément éditable.

✨ La plateforme combine robustesse data (Kafka/Spark/Hadoop) et flexibilité dev (React/FastAPI/Node).

---

## 📌 Prochaines Étapes (Roadmap Designée)

* Dashboard d’observabilité (Grafana, Prometheus)
* Scaling Spark Workers & Kafka partitions

---

🎉 **Bon développement et expérimentation streaming !**



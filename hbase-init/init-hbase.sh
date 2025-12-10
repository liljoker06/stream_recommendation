#!/bin/bash

echo "🕒 Attente démarrage HBase..."
# Boucle jusqu'à réponse OK
until echo "status" | hbase shell 2>/dev/null | grep -q "active master"; do
  echo "⏳ HBase pas prêt encore..."
  sleep 5
done

echo "🚀 HBase est opérationnel ! Vérification des tables..."

# On check uniquement par nom exact
TABLES=$(echo "list" | hbase shell | sed -n '/TABLE/,/row/p')

if echo "$TABLES" | grep -q "interactions"; then
  echo "✔️ Tables déjà présentes, skip création."
else
  echo "📌 Création des tables..."
  hbase shell /hbase-init/create-tables.hbase
  echo "🎯 Tables HBase créées avec succès."
fi

# Empêche l’arrêt du conteneur
tail -f /dev/null

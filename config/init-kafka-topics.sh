#!/bin/sh

echo "Waiting for Kafka to start..."
sleep 8

echo "Creating Kafka topics..."

create_topic () {
  /opt/kafka/bin/kafka-topics.sh --create --if-not-exists \
    --topic "$1" \
    --partitions 3 \
    --replication-factor 1 \
    --bootstrap-server kafka:9092

  echo "Topic $1 created"
}

create_topic user_events
create_topic interactions
create_topic recommendations
create_topic sessions

echo "Kafka topics initialization complete"
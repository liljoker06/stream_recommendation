import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "streaming-events-service",
  brokers: ["kafka:9092"]
});

const producer = kafka.producer();
let connected = false;

export async function sendUserEvent(eventData) {
  if (!connected) {
    await producer.connect();
    connected = true;
    console.log("Kafka connecté via kafkaProducer.js");
  }

  await producer.send({
    topic: "user_events",
    messages: [{ value: JSON.stringify(eventData) }],
  });
}

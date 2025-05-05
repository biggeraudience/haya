const kafka = require("kafka-node");

// Use process.env.KAFKA_HOST, which should be set to "localhost:9092"
// Ensure that Kafka's advertised.listeners matches this value!
const client = new kafka.KafkaClient({
  kafkaHost: process.env.KAFKA_HOST || "localhost:9092",
  connectTimeout: 30000,
  requestTimeout: 30000,
});
const Producer = kafka.Producer;
const producer = new Producer(client);

producer.on("ready", () => {
  console.log("✅ Kafka Producer is ready");
});

producer.on("error", (err) => {
  console.error("❌ Kafka Producer error:", err);
});

/**
 * Pushes an event to Kafka.
 * Partitions events by type: 'sales_metrics' for sales events, 'user_events' otherwise.
 * @param {Object} eventData - The enriched event data.
 */
function pushEventToKafka(eventData) {
  const salesEvents = ["ADD_TO_CART", "PURCHASE_COMPLETED"];
  const topic = salesEvents.includes(eventData.eventType) ? "sales_metrics" : "user_events";
  const payloads = [{ topic, messages: JSON.stringify(eventData) }];

  const sendMessage = (retryCount = 0) => {
    producer.send(payloads, (err, data) => {
      if (err) {
        const errMsg = err.message.toLowerCase();
        if (
          (errMsg.includes("leadernotavailable") ||
            errMsg.includes("broker not available") ||
            errMsg.includes("timed out")) &&
          retryCount < 5
        ) {
          console.error(`❌ Error "${err.message}", retrying (${retryCount + 1}/5)...`);
          setTimeout(() => sendMessage(retryCount + 1), 1000);
        } else {
          console.error("❌ Error sending event to Kafka:", err);
          // Log the error and continue without throwing.
        }
      } else {
        console.log("✅ Event sent to Kafka:", data);
      }
    });
  };

  sendMessage();
}

module.exports = { pushEventToKafka };

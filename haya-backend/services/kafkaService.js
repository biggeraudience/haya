// ../haya-backend/services/kafkaService.js (Refactored for Cloudflare Workers)

const kafka = require("kafka-node");

// Declare client and producer variables but do NOT initialize them at the top level.
let client = null;
let producer = null;


function initializeKafkaClient() {
  // Only initialize if the client hasn't been created during this Worker's lifetime
  if (!client) {
    try {
     client = new kafka.KafkaClient({
        kafkaHost: process.env.KAFKA_HOST, // Use the environment variable
        // connectTimeout and requestTimeout might need tuning for the Worker environment
        connectTimeout: 30000, // 30 seconds
        requestTimeout: 30000, // 30 seconds
         // Consider adding a clientId property
         clientId: 'cloudflare-worker'
      });

      // Create the producer using the client
      Producer = kafka.Producer; // Ensure Producer is accessible if not already in scope
      producer = new Producer(client);

      // Attach listeners AFTER creating the producer.
      producer.on("ready", () => {
        console.log("✅ Kafka Producer is ready");
      });

      producer.on("error", (err) => {
        console.error("❌ Kafka Producer error:", err);

      });

      // Add client error listener as well
      client.on('error', (err) => {
        console.error('❌ Kafka Client error:', err);
         // Same considerations as producer error handling
      });

    } catch (initError) {
      console.error("❌ Failed to initialize Kafka client/producer:", initError);
      // If initialization fails, set client/producer to null so it's attempted again on next call
      client = null;
      producer = null;

    }
  }
}



function pushEventToKafka(eventData) {
  // Ensure the Kafka client and producer are initialized. This happens lazily on the first call.
  initializeKafkaClient();

  // Check if initialization was successful before attempting to send
  if (!producer) {
      console.error("❌ Kafka Producer is not initialized. Cannot send event.");
      // Decide how to handle this: log, return, throw, or use an alternative mechanism.
      return; // Exit the function if producer is not ready
  }


  const salesEvents = ["ADD_TO_CART", "PURCHASE_COMPLETED"];
  const topic = salesEvents.includes(eventData.eventType) ? "sales_metrics" : "user_events";
  // Kafka messages are typically strings or buffers. JSON.stringify is correct here.
  const payloads = [{ topic, messages: JSON.stringify(eventData) }];

  producer.send(payloads, (err, data) => {
    if (err) {
      // Simplified error handling for the send callback within a Worker context
      console.error("❌ Error sending event to Kafka (within send callback):", err);

    } else {
      console.log("✅ Event sent to Kafka:", data);
    }
  });

}

// Re-export the function
module.exports = { pushEventToKafka };

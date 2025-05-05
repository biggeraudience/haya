const amqp = require("amqplib");

let channel = null;

/**
 * Attempts to initialize the RabbitMQ connection with retries.
 */
async function initRabbitMQ(retries = 5, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
      channel = await connection.createChannel();
      console.log("✅ RabbitMQ channel created");
      return;
    } catch (err) {
      console.error(`❌ RabbitMQ connection error (attempt ${i}):`, err.message);
      if (i < retries) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error("❌ RabbitMQ connection failed after maximum retries");
}

/**
 * Sends a message to a specified queue.
 * @param {string} queue - The queue name.
 * @param {Object} message - The message to send.
 */
async function sendToQueue(queue, message) {
  if (!channel) {
    console.error("RabbitMQ channel is not initialized");
    return;
  }
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log(`✅ Message sent to queue ${queue}`);
}

module.exports = { initRabbitMQ, sendToQueue };

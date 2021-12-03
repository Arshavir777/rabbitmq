const amqplib = require("amqplib");
const AMQP_URL = process.env.AMQP_URL || "amqp://localhost:5673";
const QUEUE_1 = process.env.AMQP_QUEUE_1 || "special-queue-1";
const QUEUE_2 = process.env.AMQP_QUEUE_2 || "special-queue-2";

const EXCHANGE_NAME = "exchange-2";
const EXCHANGE_TYPE = "direct";
const ROUTING_KEY = "rounting-2";

async function processMessage(msg) {
  console.log(msg.content.toString());
}

(async () => {
  // init connection
  const connection = await amqplib.connect(AMQP_URL, "heartbeat=60");

  // create channel
  const channel = await connection.createChannel();
  try {
    // create exchange by name and type
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true,
    });

    // create queue
    await channel.assertQueue(QUEUE_2);
    await channel.assertQueue(QUEUE_1);

    // bind queue with exchange
    await channel.bindQueue(QUEUE_2, EXCHANGE_NAME, ROUTING_KEY);

    const msg = {
      id: Math.floor(Math.random() * 1000),
      from: "service-2",
    };

    setInterval(async () => {
      // publish message
      await channel.publish(
        EXCHANGE_NAME,
        ROUTING_KEY,
        Buffer.from(JSON.stringify(msg))
      );
      console.log("SERVICE-2: message published");
    }, 3000);

    await channel.consume(
      QUEUE_1,
      async (msg) => {
        console.log("SERVICE-2: processing messages");
        await processMessage(msg);
        await channel.ack(msg);
      },
      {
        noAck: false,
        consumerTag: "consumer-2",
      }
    );
    console.log("SERVICE-2: waiting for messages");

    // close connections and channell on SIGINT signal
    process.once("SIGINT", async () => {
      console.log("SERVICE-2:got sigint, closing connection");
      await channel.close();
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.log("SERVICE-2: ERROR: ", error);
    await channel.close();
    await connection.close();
  }
})();

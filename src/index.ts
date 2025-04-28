import { RabbitMQ } from "./rabbitmq";
import { db } from "./database";

const rabbitMQ = new RabbitMQ();

(async () => {
    await db.connect();
    await rabbitMQ.connect("amqp://localhost");

    rabbitMQ.consume("user-queue", async (message) => {
        try {
            const parsedMessage = JSON.parse(message);

            // Validate the message payload
            const { name, email } = parsedMessage;
            if (!name || !email) {
                console.error("Invalid message payload:", parsedMessage);
                return;
            }

            // Insert into the database
            await db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
            console.log(`User ${name} saved to database`);
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });
})();
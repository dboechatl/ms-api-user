import { RabbitMQ } from "./rabbitmq";
import { db } from "./database";

const rabbitMQ = new RabbitMQ();

(async () => {
    try {
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
                const query = "INSERT INTO users (name, email) VALUES (?, ?)";
                await db.query(query, [name, email]);
                console.log(`User ${name} saved to database`);
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    } catch (error) {
        console.error("Error initializing the consumer:", error);
        process.exit(1);  // Exit if there is an error in connecting to RabbitMQ or the database
    }
})();

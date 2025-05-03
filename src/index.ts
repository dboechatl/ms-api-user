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
                if (parsedMessage.action !== "USER_CREATED" || !parsedMessage.data) {
                    console.error("Invalid message payload:", parsedMessage);
                    return;
                }

                const { name, email } = parsedMessage.data;
                if (!name || !email) {
                    console.error("Invalid user data:", parsedMessage.data);
                    return;
                }

                // Insert into the database
                const query = "INSERT INTO users (name, email) VALUES (?, ?)";
                await db.query(query, [name, email]);
                console.log(`User ${name} saved to database`);

                // Publish a message to RabbitMQ for the email microservice
                const emailMessage = JSON.stringify({ name, email });
                await rabbitMQ.publish("email-queue", emailMessage);
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    } catch (error) {
        console.error("Error initializing the consumer:", error);
        process.exit(1);  // Exit if there is an error in connecting to RabbitMQ or the database
    }
})();

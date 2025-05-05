import express from "express";
import userRoutes from "./routes/user.routes";
import { RabbitMQService } from "./services/rabbitmq.service";
import { DatabaseService } from "./services/database.service";
import { UserController } from "./controllers/user.controller";

const app = express();
app.use(express.json());

// Connect to services
(async () => {
    try {
        await DatabaseService.connect();
        await RabbitMQService.connect("amqp://localhost");
        console.log("Services connected successfully");

        // Consume messages from RabbitMQ
        RabbitMQService.consume("user-queue", async (message) => {
            try {
                const parsedMessage = JSON.parse(message);

                // Validate and process the message
                if (parsedMessage.action === "USER_CREATED" && parsedMessage.data) {
                    await UserController.createUser(parsedMessage.data);
                } else {
                    console.error("Invalid message payload:", parsedMessage);
                }
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    } catch (error) {
        console.error("Failed to initialize services:", error);
        process.exit(1);
    }
})();

// Register routes
app.use("/api", userRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
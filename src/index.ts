import express from "express";
import userRoutes from "./routes/user.routes";
import { RabbitMQService } from "./services/rabbitmq.service";
import { DatabaseService } from "./services/database.service";
import { UserController } from "./controllers/user.controller";

const app = express();
app.use(express.json());

(async () => {
    try {
        await DatabaseService.connect();
        await RabbitMQService.connect("amqp://localhost");
        console.log("Services connected successfully");

        // Consome mensagens da fila "user-queue"
        RabbitMQService.consume("user-queue", async (message) => {
            try {
                const parsedMessage = JSON.parse(message);

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

app.use("/api", userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
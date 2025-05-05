import { UserModel } from "../models/user.model";
import { RabbitMQService } from "../services/rabbitmq.service";

export class UserController {
    static async createUser(data: { name: string; email: string }) {
        const { name, email } = data;

        if (!name || !email) {
            throw new Error("Invalid user data");
        }

        // Save user to the database
        await UserModel.createUser(name, email);

        // Publish message to RabbitMQ
        const message = JSON.stringify({ name, email });
        await RabbitMQService.publish("email-queue", message);

        return { message: `User ${name} created successfully` };
    }
}
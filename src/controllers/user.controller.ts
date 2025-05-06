import { UserModel } from "../models/user.model";
import { RabbitMQService } from "../services/rabbitmq.service";

export class UserController {
    static async createUser(data: { name: string; email: string }) {
        const { name, email } = data;

        if (!name || !email) {
            throw new Error("Invalid user data");
        }

        // Salva o usuário no banco de dados
        await UserModel.createUser(name, email);

        // Publica uma mensagem no RabbitMQ para notificar outros microsserviços
        const message = JSON.stringify({ name, email });
        await RabbitMQService.publish("email-queue", message);

        return { message: `User ${name} created successfully` };
    }
}
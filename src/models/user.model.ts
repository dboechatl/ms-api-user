import { DatabaseService } from "../services/database.service";

export class UserModel {
    static async createUser(name: string, email: string) {
        const query = "INSERT INTO users (name, email) VALUES (?, ?)";
        await DatabaseService.query(query, [name, email]);
    }
}
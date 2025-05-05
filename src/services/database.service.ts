import mysql from "mysql2/promise";

export class DatabaseService {
    private static connection: mysql.Connection | null = null;

    static async connect() {
        if (!this.connection) {
            this.connection = await mysql.createConnection({
                host: "localhost",
                user: "swm_user",
                password: "1234",
                database: "swm_database",
                port: 3307,
            });
        }
    }

    static async query(sql: string, params: any[]) {
        if (!this.connection) throw new Error("Database connection is not initialized");
        return this.connection.execute(sql, params);
    }
}
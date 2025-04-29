import mysql from "mysql2/promise";

export const db = {
    connection: null as mysql.Connection | null,

    async connect() {
        try {
            this.connection = await mysql.createConnection({
                host: "localhost",
                user: "swm_user",
                password: "1234",
                database: "swm_database",
                port: 3307,
            });
            console.log("Connected to MySQL");
        } catch (error) {
            console.error("Database connection failed:", error);
            throw error;
        }
    },

    async query(sql: string, params: any[]) {
        if (!this.connection) throw new Error("Database connection is not initialized");
        return this.connection.execute(sql, params);
    },

    async close() {
        if (this.connection) {
            await this.connection.end();
            console.log("MySQL connection closed");
        }
    }
};

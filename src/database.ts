import mysql from "mysql2/promise";

export const db = {
    connection: null as mysql.Connection | null,

    async connect() {
        this.connection = await mysql.createConnection({
            host: "localhost",
            user: "swm_user",
            password: "1234",
            database: "swm_database",
            port: 3307,
        });
        console.log("Connected to MySQL");
    },

    async query(sql: string, params: any[]) {
        if (!this.connection) throw new Error("Database connection is not initialized");
        return this.connection.execute(sql, params);
    },
};
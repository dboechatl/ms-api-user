import amqplib, { Connection, Channel, ConsumeMessage } from "amqplib";

export class RabbitMQ {
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    async connect(url: string): Promise<void> {
        try {
            this.connection = await amqplib.connect(url);
            this.channel = await this.connection.createChannel();
            console.log("Connected to RabbitMQ");
        } catch (error) {
            console.error("Failed to connect to RabbitMQ:", error);
            throw error;
        }
    }

    async consume(queue: string, callback: (message: string) => void): Promise<void> {
        if (!this.channel) throw new Error("RabbitMQ channel is not initialized");

        await this.channel.assertQueue(queue, { durable: true });

        this.channel.consume(queue, (msg: ConsumeMessage | null) => {
            if (msg) {
                console.log("Consuming message:", msg.content.toString());
                callback(msg.content.toString());
                this.channel?.ack(msg);
            }
        });
    }

    async publish(queue: string, message: string): Promise<void> {
        if (!this.channel) throw new Error("RabbitMQ channel is not initialized");

        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(message));
        console.log(`Message published to queue ${queue}: ${message}`);
    }
}

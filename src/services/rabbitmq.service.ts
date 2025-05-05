import amqplib, { Channel, Connection, ConsumeMessage } from "amqplib";

export class RabbitMQService {
    private static connection: Connection | null = null;
    private static channel: Channel | null = null;

    static async connect(url: string) {
        if (!this.connection) {
            this.connection = await amqplib.connect(url);
            this.channel = await this.connection.createChannel();
        }
    }

    static async publish(queue: string, message: string) {
        if (!this.channel) throw new Error("RabbitMQ channel is not initialized");
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(message));
    }

    static async consume(queue: string, callback: (message: string) => void) {
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
}
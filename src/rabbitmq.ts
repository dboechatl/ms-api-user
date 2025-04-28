import amqplib, { Connection, Channel, ConsumeMessage } from "amqplib";

export class RabbitMQ {
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    async connect(url: string): Promise<void> {
        this.connection = await amqplib.connect(url);
        this.channel = await this.connection.createChannel();
    }

    async consume(queue: string, callback: (message: string) => void): Promise<void> {
        if (!this.channel) throw new Error("RabbitMQ channel is not initialized");
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, (msg: ConsumeMessage | null) => {
            if (msg) {
                callback(msg.content.toString());
                this.channel?.ack(msg);
            }
        });
    }
}
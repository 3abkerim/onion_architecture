import amqp from "amqplib";
import { IMessageBroker } from "../../interfaces/message-broker.interface";

export class RabbitMQPublisher implements IMessageBroker {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(private readonly url: string) {}

  async connect() {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      console.log("Channel initialized");
    } catch (error) {
      console.log("Failed to connect to RabbitMQ", error);
    }
  }

  async publish(queue: string, message: any): Promise<void> {
    if (!this.channel) throw new Error("Channel not initialized");

    const messageText = Buffer.from(JSON.stringify(message));

    await this.channel.assertQueue(queue, { durable: false });
    this.channel.sendToQueue(queue, messageText);
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  isConnected() {
    return this.connection !== null;
  }
}

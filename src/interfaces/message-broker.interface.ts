export interface IMessageBroker {
  connect(): Promise<void>;
  publish(queue: string, message: any): Promise<void>;
  close(): Promise<void>;
  isConnected(): boolean;
}

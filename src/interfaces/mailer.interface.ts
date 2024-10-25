import { Email } from "../domain/value_objects/email";

export interface IMailer {
    send(email: Email): Promise<void>
}
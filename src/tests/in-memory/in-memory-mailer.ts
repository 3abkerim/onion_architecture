import { Email } from "../../domain/value_objects/email";
import { IMailer } from "../../interfaces/mailer.interface";


export class InMemoryMailer implements IMailer {
    public readonly sentEmails: Email[] = []

    async send(email: Email): Promise<void> {
        this.sentEmails.push(email)
    }
}
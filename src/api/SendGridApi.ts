import { IEmailProvider } from "../interfaces/IEmailProvider";
import { EmailTemplate } from "../types";

export class SendGridEmailService implements IEmailProvider {
    async sendEmail(template: EmailTemplate) {
        // TODO: Implement email sending logic
    }
}
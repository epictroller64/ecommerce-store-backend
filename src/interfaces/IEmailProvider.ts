import { EmailTemplate } from "../types";

export interface IEmailProvider {
    sendEmail(template: EmailTemplate): Promise<void>
}
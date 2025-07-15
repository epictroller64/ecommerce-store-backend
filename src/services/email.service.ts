import { config } from "../configuration";
import { IEmailProvider } from "../interfaces/IEmailProvider";
import { EmailTemplate } from "../types";

// Handle sending emails, we can add more providers later
export class EmailService {

    private emailProvider: IEmailProvider;

    constructor(emailProvider: IEmailProvider) {
        this.emailProvider = emailProvider;
    }

    async sendOrderConfirmation(orderId: string) {
        const template: EmailTemplate = {
            id: 'order-confirmed',
            subject: 'Order Confirmed',
            body: 'Your order has been confirmed',
            template: 'order-confirmed',
            variables: {
                orderId: orderId
            }
        }
        await this.emailProvider.sendEmail(template);
    }

    async sendOrderCancelled(orderId: string) {
        const template: EmailTemplate = {
            id: 'order-cancelled',
            subject: 'Order Cancelled',
            body: 'Your order has been cancelled',
            template: 'order-cancelled',
            variables: {
                orderId: orderId
            }
        }
        await this.emailProvider.sendEmail(template);
    }

    async sendResetPassword(email: string, token: string) {
        const template: EmailTemplate = {
            id: 'reset-password',
            subject: 'Reset Password',
            body: 'Click the link below to reset your password',
            template: 'reset-password',
            variables: {
                email: email,
                token: token
            }
        }
        await this.emailProvider.sendEmail(template);
    }
}





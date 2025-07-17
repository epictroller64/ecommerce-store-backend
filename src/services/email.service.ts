
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

    async sendOrderProcessing(orderId: string) {
        const template: EmailTemplate = {
            id: 'order-processing',
            subject: 'Order Processing',
            body: 'Your order is now being processed',
            template: 'order-processing',
            variables: {
                orderId: orderId
            }
        }
        await this.emailProvider.sendEmail(template);
    }

    async sendOrderShipped(orderId: string) {
        const template: EmailTemplate = {
            id: 'order-shipped',
            subject: 'Order Shipped',
            body: 'Your order has been shipped',
            template: 'order-shipped',
            variables: {
                orderId: orderId
            }
        }
        await this.emailProvider.sendEmail(template);
    }

    async sendOrderDelivered(orderId: string) {
        const template: EmailTemplate = {
            id: 'order-delivered',
            subject: 'Order Delivered',
            body: 'Your order has been delivered',
            template: 'order-delivered',
            variables: {
                orderId: orderId
            }
        }
        await this.emailProvider.sendEmail(template);
    }

    async sendOrderRefunded(orderId: string) {
        const template: EmailTemplate = {
            id: 'order-refunded',
            subject: 'Order Refunded',
            body: 'Your order has been refunded',
            template: 'order-refunded',
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





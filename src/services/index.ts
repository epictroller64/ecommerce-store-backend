// Service layer exports
export * from './auth.service';
export * from './user.service';
export * from './order.service';
export * from './payment.service';
export * from './delivery.service';
export * from './site.service';
export * from './product.service';

// Initialize services
import { config } from '../configuration';
import { EmailService } from './email.service';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';

export const emailService = new EmailService(config.emailProvider);
export const paymentService = new PaymentService(config.paymentProviders, config.webhookHandlers);
export const orderService = new OrderService(emailService);
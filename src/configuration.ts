


// Config file for the backend

import { SendGridEmailService } from "./api/SendGridApi";
import { StripeApi } from "./api/StripeApi";
import { ConfigurationPaymentProvider, WebhookConfig } from "./types";


export const config = {
    emailProvider: new SendGridEmailService(), // provider is registered by the backend
    paymentProviders: [{ id: 'stripe', provider: new StripeApi(), webhookPath: '/webhook/stripe' }] as ConfigurationPaymentProvider[], // provider is registered by the backend and found by the id
    webhookHandlers: [{ id: 'stripe', path: '/webhook/stripe', handler: new StripeApi().handleWebhook }] as WebhookConfig[] // handler is registered by the backend and found by the id
}


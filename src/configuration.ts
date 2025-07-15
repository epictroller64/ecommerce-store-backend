


// Config file for the backend

import { SendGridEmailService } from "./api/SendGridApi";


export const config = {
    emailProvider: new SendGridEmailService(), // provider is registered by the backend
}
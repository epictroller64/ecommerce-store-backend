import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';

//routes
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import staticRouter from './routes/static';
import categoriesRouter from './routes/categories';
import ordersRouter from './routes/orders';
import paymentMethodsRouter from './routes/payment-methods';
import deliveryMethodsRouter from './routes/delivery-methods';
import siteRouter from './routes/site';
import mockDataRouter from './routes/mock-data';
import reviewsRouter from './routes/reviews';
import { router as webhookRouter } from './routes/webhook';


const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/health', (req, res) => {
    // health check
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/payment-methods', paymentMethodsRouter);
app.use('/delivery-methods', deliveryMethodsRouter);
app.use('/site', siteRouter);
app.use('/mock-data', mockDataRouter);
app.use('/static', staticRouter);
app.use('/reviews', reviewsRouter);
app.use('/webhook', webhookRouter);

//handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

//handle errors, gotta be last one
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

export default app; 
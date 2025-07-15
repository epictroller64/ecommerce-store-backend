import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';

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


const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/auth/register-user, /auth/login-user`);
    console.log(`👤 User endpoints: http://localhost:${PORT}/users/get-user, /users/update-user-settings`);
    console.log(`🛍️  Product endpoints: http://localhost:${PORT}/products/get-products, /products/get-product, /products/get-best-selling-products`);
    console.log(`📂 Category endpoints: http://localhost:${PORT}/categories/get-categories`);
    console.log(`📦 Order endpoints: http://localhost:${PORT}/orders/create-order, /orders/get-orders, /orders/get-order, /orders/cancel-order, /orders/complete-checkout`);
    console.log(`💳 Payment endpoints: http://localhost:${PORT}/payment-methods/get-payment-methods`);
    console.log(`🚚 Delivery endpoints: http://localhost:${PORT}/delivery-methods/get-delivery-methods`);
    console.log(`🏠 Site endpoints: http://localhost:${PORT}/site/get-site-info, /site/get-hero-images, /site/get-config`);
    console.log(`🎲 Mock data endpoints: http://localhost:${PORT}/mock-data/generate-all, /mock-data/generate-categories, /mock-data/generate-products, /mock-data/clear-all`);
});

export default app; 
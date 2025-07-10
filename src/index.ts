import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

//routes
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import ordersRouter from './routes/orders';
import paymentMethodsRouter from './routes/payment-methods';
import deliveryMethodsRouter from './routes/delivery-methods';
import siteRouter from './routes/site';

dotenv.config();

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

app.use('/register-user', authRouter);
app.use('/login-user', authRouter);
app.use('/get-user', usersRouter);
app.use('/update-user-settings', usersRouter);

app.use('/get-products', productsRouter);
app.use('/get-best-selling-products', productsRouter);
app.use('/get-product', productsRouter);

app.use('/get-categories', categoriesRouter);

app.use('/create-order', ordersRouter);
app.use('/get-orders', ordersRouter);
app.use('/get-order', ordersRouter);
app.use('/cancel-order', ordersRouter);
app.use('/complete-checkout', ordersRouter);

app.use('/get-payment-methods', paymentMethodsRouter);
app.use('/get-delivery-methods', deliveryMethodsRouter);

app.use('/get-site-info', siteRouter);
app.use('/get-hero-images', siteRouter);
app.use('/get-config', siteRouter);

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
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/register-user, /login-user`);
    console.log(`👤 User endpoints: http://localhost:${PORT}/get-user, /update-user-settings`);
    console.log(`🛍️  Product endpoints: http://localhost:${PORT}/get-products, /get-product, /get-best-selling-products`);
    console.log(`📂 Category endpoints: http://localhost:${PORT}/get-categories`);
    console.log(`📦 Order endpoints: http://localhost:${PORT}/create-order, /get-orders, /get-order, /cancel-order, /complete-checkout`);
    console.log(`💳 Payment endpoints: http://localhost:${PORT}/get-payment-methods`);
    console.log(`🚚 Delivery endpoints: http://localhost:${PORT}/get-delivery-methods`);
    console.log(`🏠 Site endpoints: http://localhost:${PORT}/get-site-info, /get-hero-images, /get-config`);
});

export default app; 
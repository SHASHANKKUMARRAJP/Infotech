import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import productRoutes from './routes/products';
import inventoryRoutes from './routes/inventory';
import challanRoutes from './routes/challans';
import usersRouter from './routes/users';
import dashboardRoutes from './routes/dashboard';
import { authenticateJWT, authorizeRole } from './middleware/auth';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/challans', challanRoutes);
app.use('/api/users', usersRouter);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the InfoTech ERP + CRM API Portal.', health: '/health' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Protected test route for Admin only
app.get('/api/admin-only', authenticateJWT, authorizeRole(['ADMIN']), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

// Global error-handling middleware (must be after all routes)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err.stack || err.message || err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

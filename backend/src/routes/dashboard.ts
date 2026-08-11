import { Router } from 'express';
import { query } from '../db';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

// GET /api/dashboard - Get dashboard metrics
router.get('/', authorizeRole(['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']), async (req, res) => {
  try {
    // Total Customers
    const customersRes = await query('SELECT COUNT(*) FROM customers');
    const totalCustomers = parseInt(customersRes.rows[0].count, 10);

    // Total Products
    const productsRes = await query('SELECT COUNT(*) FROM products');
    const totalProducts = parseInt(productsRes.rows[0].count, 10);

    // Current Stock (Sum of all product stock)
    const stockRes = await query('SELECT SUM(current_stock) as total_stock FROM products');
    const totalStock = parseInt(stockRes.rows[0].total_stock || '0', 10);

    // Low-stock products
    const lowStockRes = await query('SELECT COUNT(*) FROM products WHERE current_stock <= minimum_stock_quantity');
    const lowStockProducts = parseInt(lowStockRes.rows[0].count, 10);

    // Recent Challans (last 5)
    const recentChallansRes = await query(`
      SELECT sc.id, sc.challan_number, sc.status, sc.total_amount, sc.created_at, c.name as customer_name 
      FROM sales_challans sc 
      JOIN customers c ON sc.customer_id = c.id 
      ORDER BY sc.created_at DESC LIMIT 5
    `);

    // Recent Stock Movements (last 5)
    const recentMovementsRes = await query(`
      SELECT sm.id, sm.movement_type, sm.quantity, sm.created_at, p.product_name 
      FROM stock_movements sm 
      JOIN products p ON sm.product_id = p.id 
      ORDER BY sm.created_at DESC LIMIT 5
    `);

    res.json({
      totalCustomers,
      totalProducts,
      totalStock,
      lowStockProducts,
      recentChallans: recentChallansRes.rows,
      recentStockMovements: recentMovementsRes.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

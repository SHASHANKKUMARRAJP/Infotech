import { Router } from 'express';
import { query } from '../db';
import { authenticateJWT, authorizeRole, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateJWT);

// POST /api/inventory/move
router.post('/move', authorizeRole(['ADMIN', 'WAREHOUSE']), async (req: AuthRequest, res) => {
  const client = await require('../db').pool.connect();
  
  try {
    const { product_id, movement_type, quantity, reason } = req.body;
    const created_by = req.user?.id;

    if (!product_id || !movement_type || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'product_id, movement_type (IN/OUT), and a positive quantity are required' });
    }

    if (!['IN', 'OUT'].includes(movement_type)) {
      return res.status(400).json({ error: 'Invalid movement_type. Must be IN or OUT.' });
    }

    await client.query('BEGIN');

    // Lock the product row for update to prevent race conditions
    const productResult = await client.query('SELECT current_stock FROM products WHERE id = $1 FOR UPDATE', [product_id]);
    
    if (productResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentStock = productResult.rows[0].current_stock;

    if (movement_type === 'OUT' && currentStock < quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Insert stock movement
    const movementResult = await client.query(
      `INSERT INTO stock_movements (product_id, movement_type, quantity, remarks, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [product_id, movement_type, quantity, reason, created_by]
    );

    // Update product stock
    const stockChange = movement_type === 'IN' ? quantity : -quantity;
    await client.query(
      `UPDATE products SET current_stock = current_stock + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [stockChange, product_id]
    );

    await client.query('COMMIT');
    res.status(201).json(movementResult.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// GET /api/inventory/movements
router.get('/movements', authorizeRole(['ADMIN', 'WAREHOUSE']), async (req, res) => {
  try {
    const result = await query(
      `SELECT sm.*, p.product_name, p.sku, u.first_name, u.last_name 
       FROM stock_movements sm
       JOIN products p ON sm.product_id = p.id
       LEFT JOIN users u ON sm.created_by = u.id
       ORDER BY sm.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

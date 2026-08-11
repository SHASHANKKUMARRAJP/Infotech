import { Router } from 'express';
import { query } from '../db';
import { authenticateJWT, authorizeRole, AuthRequest } from '../middleware/auth';
import { pool } from '../db';

const router = Router();
router.use(authenticateJWT);

// Generate unique challan number
function generateChallanNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `CH-${dateStr}-${randomStr}`;
}

// GET /api/challans
router.get('/', authorizeRole(['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']), async (req, res) => {
  try {
    const result = await query(
      `SELECT sc.*, c.name as customer_name 
       FROM sales_challans sc
       JOIN customers c ON sc.customer_id = c.id
       ORDER BY sc.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/challans/:id
router.get('/:id', authorizeRole(['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']), async (req, res) => {
  try {
    const { id } = req.params;
    const challanResult = await query(
      `SELECT sc.*, c.name as customer_name 
       FROM sales_challans sc
       JOIN customers c ON sc.customer_id = c.id
       WHERE sc.id = $1`,
      [id]
    );

    if (challanResult.rows.length === 0) {
      return res.status(404).json({ error: 'Challan not found' });
    }

    const itemsResult = await query(
      `SELECT * FROM sales_challan_items WHERE challan_id = $1`,
      [id]
    );

    res.json({
      ...challanResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/challans (Create DRAFT)
router.post('/', authorizeRole(['ADMIN', 'SALES']), async (req: AuthRequest, res) => {
  const client = await pool.connect();
  try {
    const { challan_number, customer_id, items } = req.body;
    const created_by = req.user?.id;

    if (!customer_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing customer_id or items' });
    }

    const finalChallanNumber = challan_number || generateChallanNumber();

    await client.query('BEGIN');

    let total_amount = 0;
    let total_quantity = 0;

    // Create the challan as DRAFT
    const challanResult = await client.query(
      `INSERT INTO sales_challans (challan_number, customer_id, status, total_amount, total_quantity, created_by)
       VALUES ($1, $2, 'DRAFT', 0, 0, $3) RETURNING *`,
      [finalChallanNumber, customer_id, created_by]
    );
    const challanId = challanResult.rows[0].id;

    // Insert items
    for (const item of items) {
      const { product_id, quantity } = item;

      if (quantity <= 0) {
        throw new Error('Quantity must be greater than zero');
      }

      // Fetch product snapshot
      const productResult = await client.query('SELECT product_name, sku, unit_price FROM products WHERE id = $1', [product_id]);
      if (productResult.rows.length === 0) {
        throw new Error(`Product ${product_id} not found`);
      }
      const product = productResult.rows[0];
      const unit_price = product.unit_price;
      const subtotal = quantity * unit_price;

      total_amount += subtotal;
      total_quantity += quantity;

      // Insert item snapshot
      await client.query(
        `INSERT INTO sales_challan_items (challan_id, product_id, product_name_snapshot, sku_snapshot, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [challanId, product_id, product.product_name, product.sku, quantity, unit_price]
      );
    }

    // Update totals
    const finalChallan = await client.query(
      `UPDATE sales_challans SET total_amount = $1, total_quantity = $2 WHERE id = $3 RETURNING *`,
      [total_amount, total_quantity, challanId]
    );

    await client.query('COMMIT');
    res.status(201).json(finalChallan.rows[0]);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Challan number already exists' });
    }
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// PUT /api/challans/:id (Update DRAFT)
router.put('/:id', authorizeRole(['ADMIN', 'SALES']), async (req: AuthRequest, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { customer_id, items } = req.body;

    await client.query('BEGIN');

    const challanCheck = await client.query('SELECT status FROM sales_challans WHERE id = $1', [id]);
    if (challanCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Challan not found' });
    }
    if (challanCheck.rows[0].status !== 'DRAFT') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Only DRAFT challans can be updated directly' });
    }

    let total_amount = 0;
    let total_quantity = 0;

    // Delete existing items
    await client.query('DELETE FROM sales_challan_items WHERE challan_id = $1', [id]);

    // Insert new items
    for (const item of items) {
      const { product_id, quantity } = item;
      if (quantity <= 0) throw new Error('Quantity must be positive');

      const productResult = await client.query('SELECT product_name, sku, unit_price FROM products WHERE id = $1', [product_id]);
      if (productResult.rows.length === 0) throw new Error(`Product ${product_id} not found`);
      const product = productResult.rows[0];

      total_amount += quantity * product.unit_price;
      total_quantity += quantity;

      await client.query(
        `INSERT INTO sales_challan_items (challan_id, product_id, product_name_snapshot, sku_snapshot, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, product_id, product.product_name, product.sku, quantity, product.unit_price]
      );
    }

    // Update challan
    const finalChallan = await client.query(
      `UPDATE sales_challans 
       SET customer_id = COALESCE($1, customer_id), total_amount = $2, total_quantity = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [customer_id, total_amount, total_quantity, id]
    );

    await client.query('COMMIT');
    res.json(finalChallan.rows[0]);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(error);
    if (error.message) return res.status(400).json({ error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// PUT /api/challans/:id/confirm
router.put('/:id/confirm', authorizeRole(['ADMIN', 'SALES']), async (req: AuthRequest, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    await client.query('BEGIN');

    // 1. Get Challan
    const challanCheck = await client.query('SELECT * FROM sales_challans WHERE id = $1 FOR UPDATE', [id]);
    if (challanCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Challan not found' });
    }
    const challan = challanCheck.rows[0];

    // Prevent double confirmation
    if (challan.status === 'CONFIRMED') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Challan is already confirmed' });
    }
    if (challan.status === 'CANCELLED') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot confirm a cancelled challan' });
    }

    // 2. Get Items
    const itemsResult = await client.query('SELECT * FROM sales_challan_items WHERE challan_id = $1', [id]);
    
    // 3. Deduct Stock & Record Movements
    for (const item of itemsResult.rows) {
      // Lock product row
      const productResult = await client.query('SELECT current_stock FROM products WHERE id = $1 FOR UPDATE', [item.product_id]);
      if (productResult.rows.length === 0) throw new Error(`Product ${item.product_id} not found during stock deduction`);
      
      const currentStock = productResult.rows[0].current_stock;
      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product_name_snapshot} (${item.sku_snapshot}). Available: ${currentStock}, Required: ${item.quantity}`);
      }

      // Deduct stock
      await client.query('UPDATE products SET current_stock = current_stock - $1 WHERE id = $2', [item.quantity, item.product_id]);

      // Record OUT movement
      await client.query(
        `INSERT INTO stock_movements (product_id, movement_type, quantity, remarks, created_by) VALUES ($1, 'OUT', $2, $3, $4)`,
        [item.product_id, item.quantity, `Challan Confirmed: ${challan.challan_number}`, user_id]
      );
    }

    // 4. Update status
    const result = await client.query(
      `UPDATE sales_challans SET status = 'CONFIRMED', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(error);
    if (error.message) return res.status(400).json({ error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// PUT /api/challans/:id/cancel
router.put('/:id/cancel', authorizeRole(['ADMIN', 'SALES']), async (req: AuthRequest, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    await client.query('BEGIN');

    const challanCheck = await client.query('SELECT * FROM sales_challans WHERE id = $1 FOR UPDATE', [id]);
    if (challanCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Challan not found' });
    }
    const challan = challanCheck.rows[0];

    if (challan.status === 'CANCELLED') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Challan is already cancelled' });
    }

    // If it was already confirmed, we need to revert the stock!
    if (challan.status === 'CONFIRMED') {
      const itemsResult = await client.query('SELECT * FROM sales_challan_items WHERE challan_id = $1', [id]);
      
      for (const item of itemsResult.rows) {
        // Return stock
        await client.query('UPDATE products SET current_stock = current_stock + $1 WHERE id = $2', [item.quantity, item.product_id]);

        // Record IN movement (restock due to cancellation)
        await client.query(
          `INSERT INTO stock_movements (product_id, movement_type, quantity, remarks, created_by) VALUES ($1, 'IN', $2, $3, $4)`,
          [item.product_id, item.quantity, `Challan Cancelled: ${challan.challan_number}`, user_id]
        );
      }
    }

    const result = await client.query(
      `UPDATE sales_challans SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

export default router;

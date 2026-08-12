import { Router } from 'express';
import { query } from '../db';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();
router.use(authenticateJWT);

// GET /api/products
router.get('/', authorizeRole(['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']), async (req, res) => {
  try {
    const { search, low_stock, page = '1', limit = '10' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let baseQuery = `FROM products WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      baseQuery += ` AND (product_name ILIKE $${paramIndex} OR sku ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    if (low_stock === 'true') {
      baseQuery += ` AND current_stock <= minimum_stock_quantity`;
    }

    // Get total count
    const countResult = await query(`SELECT COUNT(*) ${baseQuery}`, params);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `SELECT * ${baseQuery} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit as string), offset);
    const result = await query(dataQuery, params);

    res.json({
      data: result.rows,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/:id
router.get('/:id', authorizeRole(['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/products
router.post('/', authorizeRole(['ADMIN', 'WAREHOUSE']), async (req, res) => {
  try {
    const { product_name, sku, category, description, unit_price, minimum_stock_quantity, warehouse_location } = req.body;

    if (!product_name || !sku || unit_price === undefined) {
      return res.status(400).json({ error: 'product_name, sku, and unit_price are required' });
    }

    if (parseFloat(unit_price) < 0) {
      return res.status(400).json({ error: 'Unit price cannot be negative' });
    }

    const result = await query(
      `INSERT INTO products (product_name, sku, category, description, unit_price, minimum_stock_quantity, warehouse_location) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [product_name, sku, category, description, unit_price, minimum_stock_quantity || 0, warehouse_location]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/products/:id
router.put('/:id', authorizeRole(['ADMIN', 'WAREHOUSE']), async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, sku, category, description, unit_price, minimum_stock_quantity, warehouse_location } = req.body;

    const result = await query(
      `UPDATE products 
       SET product_name = COALESCE($1, product_name), 
           sku = COALESCE($2, sku), 
           category = COALESCE($3, category),
           description = COALESCE($4, description), 
           unit_price = COALESCE($5, unit_price),
           minimum_stock_quantity = COALESCE($6, minimum_stock_quantity),
           warehouse_location = COALESCE($7, warehouse_location),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [product_name, sku, category, description, unit_price, minimum_stock_quantity, warehouse_location, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

import { Router } from 'express';
import { query } from '../db';
import { authenticateJWT, authorizeRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all customer routes
router.use(authenticateJWT);

// GET /api/customers - List customers with search, filter, pagination
router.get('/', authorizeRole(['ADMIN', 'SALES', 'ACCOUNTS']), async (req, res) => {
  try {
    const { search, status, type, page = '1', limit = '10' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let baseQuery = `FROM customers WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      baseQuery += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR mobile ILIKE $${paramIndex} OR business_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    if (status) {
      baseQuery += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    if (type) {
      baseQuery += ` AND customer_type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
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

// GET /api/customers/:id - Get customer details
router.get('/:id', authorizeRole(['ADMIN', 'SALES', 'ACCOUNTS']), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM customers WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/customers - Add a new customer
router.post('/', authorizeRole(['ADMIN', 'SALES']), async (req: AuthRequest, res) => {
  try {
    const { name, email, mobile, address, business_name, gst_number, customer_type, status } = req.body;
    const createdBy = req.user?.id;

    if (!name) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    // Email format validation (if provided)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
    }

    // Mobile format validation (if provided) — allows digits, spaces, dashes, parens, plus
    if (mobile) {
      const mobileRegex = /^[+]?[\d\s\-()]{7,20}$/;
      if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ error: 'Invalid mobile number format' });
      }
    }

    const result = await query(
      `INSERT INTO customers (name, email, mobile, address, business_name, gst_number, customer_type, status, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, email, mobile, address, business_name, gst_number, customer_type || 'RETAIL', status || 'LEAD', createdBy]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/customers/:id - Edit a customer
router.put('/:id', authorizeRole(['ADMIN', 'SALES']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, address, business_name, gst_number, customer_type, status } = req.body;

    const result = await query(
      `UPDATE customers 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           mobile = COALESCE($3, mobile), 
           address = COALESCE($4, address), 
           business_name = COALESCE($5, business_name), 
           gst_number = COALESCE($6, gst_number),
           customer_type = COALESCE($7, customer_type), 
           status = COALESCE($8, status), 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [name, email, mobile, address, business_name, gst_number, customer_type, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/customers/:id - Admin only
router.delete('/:id', authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM customers WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/customers/:id/followups - Get follow-up history
router.get('/:id/followups', authorizeRole(['ADMIN', 'SALES']), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT f.*, u.first_name, u.last_name FROM customer_followups f LEFT JOIN users u ON f.created_by = u.id WHERE f.customer_id = $1 ORDER BY f.created_at DESC', 
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/customers/:id/followups - Add follow-up note
router.post('/:id/followups', authorizeRole(['ADMIN', 'SALES']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { notes, followup_date } = req.body;
    const createdBy = req.user?.id;

    if (!notes || !followup_date) {
      return res.status(400).json({ error: 'Notes and follow-up date are required' });
    }

    // Verify customer exists
    const customerCheck = await query('SELECT id FROM customers WHERE id = $1', [id]);
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const result = await query(
      `INSERT INTO customer_followups (customer_id, notes, followup_date, created_by) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, notes, followup_date, createdBy]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

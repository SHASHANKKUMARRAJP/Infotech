import { Router } from 'express';
import { query } from '../db';
import { authenticateJWT, authorizeRole, AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

// Only ADMIN can access user routes
router.use(authenticateJWT);
router.use(authorizeRole(['ADMIN']));

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, role, first_name, last_name, created_at FROM users ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT id, email, role, first_name, last_name, created_at FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { email, password, role, first_name, last_name } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, first_name, last_name, created_at`,
      [email, hashedPassword, role, first_name, last_name]
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

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, first_name, last_name } = req.body;

    const result = await query(
      `UPDATE users 
       SET email = COALESCE($1, email), 
           role = COALESCE($2, role), 
           first_name = COALESCE($3, first_name),
           last_name = COALESCE($4, last_name),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING id, email, role, first_name, last_name`,
      [email, role, first_name, last_name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    // Prevent self-deletion
    if (req.user?.id === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

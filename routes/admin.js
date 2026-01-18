const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../lib/supabaseClient');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'INVALID_INPUT', message: 'Username and password required' });
    }

    const { data, error } = await supabase
      .from('admins')
      .select('id, username, password_hash, full_name')
      .eq('username', username)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, data.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: data.id, username: data.username },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      admin: {
        id: data.id,
        username: data.username,
        full_name: data.full_name,
      },
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Login failed' });
  }
});

module.exports = router;

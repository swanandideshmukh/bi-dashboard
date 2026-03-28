const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM business_data ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.json({ message: 'Reports endpoint active', data: [] });
  }
});

module.exports = router;

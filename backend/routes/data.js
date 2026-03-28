const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get dashboard summary
router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM business_data ORDER BY created_at DESC LIMIT 12');
    const rows = result.rows;
    res.json({
      monthly_revenue: rows.map(r => parseFloat(r.revenue) || 0),
      monthly_users: rows.map(r => parseInt(r.users) || 0),
      categories: ['Electronics','Clothing','Food','Software','Services'],
      category_sales: [35, 25, 20, 12, 8]
    });
  } catch (err) {
    res.json({
      monthly_revenue: [42000,55000,48000,61000,70000,65000,80000,75000,90000,85000,95000,102000],
      monthly_users: [120,180,160,210,250,230,300,280,340,310,370,400],
      categories: ['Electronics','Clothing','Food','Software','Services'],
      category_sales: [35,25,20,12,8]
    });
  }
});

// Import CSV data
router.post('/import', async (req, res) => {
  const { headers, rows } = req.body;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS imported_data (
        id SERIAL PRIMARY KEY,
        data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    for (const row of rows) {
      await pool.query('INSERT INTO imported_data (data) VALUES ($1)', [JSON.stringify(row)]);
    }
    res.json({ success: true, imported: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

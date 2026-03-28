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
```

---

## 📄 FILE 21 — `backend/.env`
```
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/bidashboard
PORT=5000
NODE_ENV=development
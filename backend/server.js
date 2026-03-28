const express = require('express');
const cors = require('cors');
require('dotenv').config();

const dataRoutes = require('./routes/data');
const reportRoutes = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'BI Dashboard API is running ✅' }));
app.use('/api/data', dataRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/borrow', require('./routes/borrow'));
app.use('/api/penalties', require('./routes/penalty'));
app.use('/api/maintenance', require('./routes/maintenance'));

app.get('/', (req, res) => res.send('✅ AssetFlow API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
/**
 * server.js
 * ------------------------------------------------------------
 * ShegerFlix API entry point. Wires up middleware, routes, and
 * error handling, then starts listening on PORT.
 * ------------------------------------------------------------
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const titleRoutes = require('./routes/titles');
const myListRoutes = require('./routes/mylist');
const historyRoutes = require('./routes/history');
const adminRoutes = require('./routes/admin');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// ---- Core middleware ----
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// ---- Static assets (posters/backdrops if served from backend) ----
app.use('/assets', express.static('public/assets'));

// ---- Health check ----
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ---- API routes ----
app.use('/api/auth', authRoutes);
app.use('/api/titles', titleRoutes);
app.use('/api/mylist', myListRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);

// ---- 404 + error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ShegerFlix API running on http://localhost:${PORT}`);
});

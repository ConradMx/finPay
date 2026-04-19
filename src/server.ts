import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import paystackRoutes from './routes/paystack';
import webhookRoutes from './routes/webhook';




const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check endpoint (helpful for mobile testing)
app.get('/api/paystack/health', (_, res) => {
  res.send('✅ Paystack backend is running');
});

// ✅ Paystack-related routes (e.g. /subscribe)
app.use('/api/paystack', paystackRoutes);

// ✅ Port config
const PORT = Number(process.env.PORT) || 3000;

// ✅ Listen on all interfaces (required for mobile access)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});



// 👇 Important: Use raw middleware for Paystack webhook to verify signature
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);


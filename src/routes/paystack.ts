


import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
console.log('[DEBUG] Loaded Paystack Secret Key:', PAYSTACK_SECRET_KEY); // ✅ Log the key

interface SubscribeRequestBody {
  email: string;
  plan: string;
}

// ======================
// 🔁 SUBSCRIPTION ROUTE
// ======================
router.post('/subscribe', async (req: Request<{}, {}, SubscribeRequestBody>, res: Response) => {
  const { email, plan } = req.body;

  if (!email || !plan) {
    console.log('[SUBSCRIBE] ❌ Missing email or plan');
    return res.status(400).json({ error: 'Email and plan are required' });
  }

  console.log('[SUBSCRIBE] Payload:', { email, plan });

  const headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  console.log('[SUBSCRIBE] Headers sent:', headers); // ✅ Log headers

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: 200000, // amount in kobo: ₦2000
        plan,
      },
      { headers }
    );

    console.log('[SUBSCRIBE] ✅ Paystack response:', response.data);
    const { authorization_url, reference } = response.data.data;
    res.json({ url: authorization_url, reference });
  } catch (error: any) {
    const paystackError = error.response?.data || error.message;
    console.error('[SUBSCRIBE] ❌ Paystack error:', paystackError);

    res.status(500).json({
      error: 'Failed to initialize subscription',
      detail: paystackError,
    });
  }
});

// ==========================
// 💳 ONE-TIME PAYMENT ROUTE
// ==========================
router.post('/payment', async (req: Request, res: Response) => {
  const { email, amount } = req.body;

  if (!email || !amount) {
    console.log('[PAYMENT] ❌ Missing email or amount');
    return res.status(400).json({ error: 'Email and amount are required' });
  }

  console.log('[PAYMENT] Payload:', { email, amount });

  const headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  console.log('[PAYMENT] Headers sent:', headers); // ✅ Log headers

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount,
      },
      { headers }
    );

    console.log('[PAYMENT] ✅ Paystack response:', response.data);
    const { authorization_url, reference } = response.data.data;
    res.json({ url: authorization_url, reference });
  } catch (error: any) {
    const paystackError = error.response?.data || error.message;
    console.error('[PAYMENT] ❌ Paystack error:', paystackError);

    res.status(500).json({
      error: 'Failed to initialize payment',
      detail: paystackError,
    });
  }
});

export default router;

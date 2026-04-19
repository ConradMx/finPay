import express, { Request, Response } from 'express';
import crypto from 'crypto';

const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

router.post('/webhook', express.raw({ type: 'application/json' }), (req: Request, res: Response) => {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(req.body)
    .digest('hex');

  const signature = req.headers['x-paystack-signature'];

  if (hash !== signature) {
    console.log('[WEBHOOK] 🚫 Invalid signature');
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(req.body.toString());

  console.log('[WEBHOOK] 🔔 Event received:', event.event);
  console.log('[WEBHOOK] Data:', event.data);

  // Handle event types
  if (event.event === 'charge.success') {
    const email = event.data.customer.email;
    const amount = event.data.amount; // in kobo
    const reference = event.data.reference;

    // ✅ You can now update user's wallet balance here
    console.log(`[WEBHOOK] ✅ Payment successful for ${email}: ₦${amount / 100}`);
  }

  res.sendStatus(200);
});

export default router;

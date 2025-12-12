import Stripe from 'stripe';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' });
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

serve(async (req) => {
  const sig = req.headers.get('stripe-signature')!;
  const raw = await req.text();
  let event;
  try { event = stripe.webhooks.constructEvent(raw, sig, endpointSecret); }
  catch (err) { return new Response((err as Error).message, { status: 400 }); }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
  }
  }
  return new Response('ok');
}, { port: 8000 });

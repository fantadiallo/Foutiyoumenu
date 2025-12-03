import Stripe from 'stripe';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' });

serve(async (req) => {
  const body = await req.json();
  // body: { orderId, lineItems:[{name,amount,quantity}], currency }
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${Deno.env.get('PUBLIC_SITE_URL')}/checkout/success?order=${body.orderId}`,
    cancel_url: `${Deno.env.get('PUBLIC_SITE_URL')}/checkout`,
    line_items: body.lineItems.map(i => ({
      price_data: { currency: body.currency, unit_amount: i.amount, product_data: { name: i.name } },
      quantity: i.quantity,
    })),
    metadata: { orderId: body.orderId },
  });
  return new Response(JSON.stringify({ url: session.url }), { headers: { 'Content-Type': 'application/json' }});
});

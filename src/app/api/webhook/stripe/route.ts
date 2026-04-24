import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: '2025-01-27-ac',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      // Update booking status to completed
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'completed' })
        .eq('id', bookingId);

      if (error) {
        console.error('Failed to update booking status:', error);
      } else {
        console.log(`Booking ${bookingId} marked as completed.`);
        // Here you could trigger the email notification as well
      }
    }
  }

  return NextResponse.json({ received: true });
}

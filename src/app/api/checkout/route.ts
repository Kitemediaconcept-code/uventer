import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      // @ts-ignore
      apiVersion: '2025-01-27-ac',
    })
  : null;

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.');
    }
    const { name, email, phone, occupation, eventId, eventName, price } = await req.json();

    // 1. Create a pending booking in Supabase
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        event_id: eventId,
        user_name: name,
        user_email: email,
        user_phone: phone,
        occupation: occupation,
        amount_paid: price,
        payment_status: 'pending'
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: eventName,
              description: `Booking for ${name}`,
            },
            unit_amount: Math.round(price * 100), // Stripe expects amounts in cents/paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?booking_success=true&booking_id=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}?booking_cancelled=true`,
      metadata: {
        bookingId: booking.id,
        eventId: eventId,
      },
      customer_email: email,
    });

    // 3. Update booking with session ID
    await supabase
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

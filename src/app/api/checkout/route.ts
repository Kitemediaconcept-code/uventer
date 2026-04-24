import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabase } from '@/lib/supabase';

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    if (!razorpay) {
      throw new Error('Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.');
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

    // 2. Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: Math.round(price * 100), // in paise
      currency: "INR",
      receipt: booking.id,
      notes: {
        eventId: eventId,
        eventName: eventName
      }
    });

    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking.id,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error: any) {
    console.error('Razorpay error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

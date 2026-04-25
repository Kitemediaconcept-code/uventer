import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Initialize clients inside the handler so env vars are available at runtime
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase environment variables are not configured.');
    }
    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.');
    }

    // Use Service Role Key to bypass RLS on server-side API
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const { name, email, phone, occupation, eventId, eventName, price } = await req.json();

    // 1. Create a pending booking in Supabase (using admin client to bypass RLS)
    const { data: booking, error: bookingError } = await supabaseAdmin
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
      key: razorpayKeyId
    });
  } catch (error: any) {
    console.error('Razorpay error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


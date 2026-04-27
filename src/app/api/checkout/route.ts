import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Hardcoded for reliability (server-side only, never exposed to browser)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret || !supabaseUrl || !serviceRoleKey) {
      console.error('Environment variables missing: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY not set.');
      return NextResponse.json({ error: 'Payment gateway or database not configured. Please contact support.' }, { status: 500 });
    }

    // Use Service Role Key to bypass RLS on server-side API
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const { name, email, phone, occupation, eventId, eventName, price } = await req.json();

    // Validate price
    const priceNum = Number(price);
    if (!priceNum || priceNum <= 0) {
      return NextResponse.json({ error: 'Event price is invalid or zero. Please check the event price.' }, { status: 400 });
    }

    // 1. Create a pending booking in Supabase (using admin client to bypass RLS)
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        event_id: eventId,
        user_name: name,
        user_email: email,
        user_phone: phone,
        occupation: occupation,
        amount_paid: priceNum,
        payment_status: 'pending'
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 2. Create Razorpay Order
    let order;
    try {
      order = await razorpay.orders.create({
        amount: Math.round(priceNum * 100), // in paise
        currency: "INR",
        receipt: booking.id.slice(0, 40), // max 40 chars
        notes: {
          eventId: eventId,
          eventName: eventName
        }
      });
    } catch (rzpError: any) {
      // Extract actual Razorpay error message
      const rzpMsg = rzpError?.error?.description || rzpError?.message || JSON.stringify(rzpError);
      console.error('Razorpay order creation failed:', rzpMsg);
      return NextResponse.json({ error: `Razorpay error: ${rzpMsg}` }, { status: 500 });
    }

    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking.id,
      key: razorpayKeyId
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    const msg = error?.error?.description || error?.message || 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

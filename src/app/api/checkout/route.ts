import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Hardcoded for reliability (server-side only, never exposed to browser)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kgwehgvokxhlgvkhygsx.supabase.co';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd2VoZ3Zva3hobGd2a2h5Z3N4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg4OTc1OCwiZXhwIjoyMDkyNDY1NzU4fQ.21r-f-CMH7CSXt25HF7sm9msTn_6gUmv7fVvV8jHrYw';
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_ShiK0u3Rhqutkg';
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'KWOYlvZZ7SoNlol5dAP9iQKk';

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


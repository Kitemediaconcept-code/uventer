import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      return NextResponse.json({ error: 'Webhook secret or signature missing' }, { status: 400 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid Razorpay signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    if (event === 'order.paid') {
      const orderId = payload.payload.order.entity.id;
      const bookingId = payload.payload.order.entity.receipt;

      // Update booking status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: 'completed',
          stripe_session_id: orderId // Re-using this field for Razorpay Order ID for now
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Database update error:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`Booking ${bookingId} confirmed via Razorpay`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Razorpay Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

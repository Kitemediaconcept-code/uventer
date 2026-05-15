import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // Verify webhook signature (optional but recommended)
    // For now, we proceed to match the payment
    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const userEmail = payment.email;
      const userPhone = payment.contact;

      // Find the latest lead with this email or phone
      const { data: booking, error } = await supabase
        .from('bookings')
        .select('*, events(event_name)')
        .or(`user_email.eq.${userEmail},user_phone.ilike.%${userPhone?.slice(-10)}%`)
        .eq('payment_status', 'lead')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (booking && !error) {
        // 1. Update Booking to Completed
        await supabase
          .from('bookings')
          .update({ payment_status: 'completed' })
          .eq('id', booking.id);

        // 2. Send Automated Ticket Email
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const ticketId = booking.stripe_session_id || 'UV-' + booking.id.substring(0, 5).toUpperCase();

        await transporter.sendMail({
          from: `"Uventer Tickets" <${process.env.SMTP_USER}>`,
          to: booking.user_email,
          subject: `Payment Confirmed: Your Ticket for ${booking.events.event_name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e0e0e0; border-radius: 20px;">
              <h1 style="color: #000; font-size: 24px; margin-bottom: 8px;">Payment Successful!</h1>
              <p style="color: #666; font-size: 16px; margin-bottom: 32px;">Hello ${booking.user_name}, your payment was verified and your ticket is now officially booked.</p>
              
              <div style="background-color: #e0e02a; padding: 24px; border-radius: 16px; text-align: center; margin-bottom: 32px;">
                <p style="text-transform: uppercase; font-size: 12px; font-weight: 900; letter-spacing: 2px; margin-bottom: 8px; color: rgba(0,0,0,0.5);">Your Official Ticket ID</p>
                <h2 style="font-size: 40px; font-weight: 900; margin: 0; color: #000;">${ticketId}</h2>
              </div>

              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Show this Ticket ID at the entrance of <strong>${booking.events.event_name}</strong>.
              </p>
              
              <p style="text-align: center; color: #999; font-size: 12px; margin-top: 32px;">
                &copy; 2026 Uventer Events.
              </p>
            </div>
          `,
        });

        console.log(`Automatic ticket sent to ${booking.user_email} for booking ${booking.id}`);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

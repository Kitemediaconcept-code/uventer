import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, name, eventName, ticketId } = await req.json();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Assuming Gmail based on SMTP_PASS comment
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Uventer Tickets" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Ticket for ${eventName} - UVENTER`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e0e0e0; border-radius: 20px;">
          <h1 style="color: #000; font-size: 24px; margin-bottom: 8px;">Booking Confirmed!</h1>
          <p style="color: #666; font-size: 16px; margin-bottom: 32px;">Hello ${name}, your ticket for <strong>${eventName}</strong> has been successfully recorded.</p>
          
          <div style="background-color: #e0e02a; padding: 24px; border-radius: 16px; text-align: center; margin-bottom: 32px;">
            <p style="text-transform: uppercase; font-size: 12px; font-weight: 900; letter-spacing: 2px; margin-bottom: 8px; color: rgba(0,0,0,0.5);">Ticket ID</p>
            <h2 style="font-size: 40px; font-weight: 900; margin: 0; color: #000;">${ticketId}</h2>
          </div>

          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Please keep this Ticket ID ready for verification at the event entrance. 
            If you have an external payment link, please ensure you complete your payment to finalize your spot.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          
          <p style="text-align: center; color: #999; font-size: 12px;">
            &copy; 2026 Uventer Events. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}

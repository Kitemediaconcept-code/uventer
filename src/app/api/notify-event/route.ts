import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, event_name, contact_details, event_date, price, image_url } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 0; border-radius: 16px; overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 40px 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
            🌟 New Event Submission
          </h1>
          <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0; font-size: 14px;">Uventer — Review Required</p>
        </div>

        <!-- Body -->
        <div style="background: #fff; padding: 36px 40px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid #f0f0f0;">
                <span style="color: #888; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Submitter Name</span><br/>
                <span style="color: #111; font-size: 16px; font-weight: 700; margin-top: 4px; display: block;">${name}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid #f0f0f0;">
                <span style="color: #888; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Event Name</span><br/>
                <span style="color: #111; font-size: 16px; font-weight: 700; margin-top: 4px; display: block;">${event_name || 'Untitled Event'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid #f0f0f0;">
                <span style="color: #888; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Location</span><br/>
                <span style="color: #111; font-size: 16px; font-weight: 700; margin-top: 4px; display: block;">📍 ${location}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid #f0f0f0;">
                <span style="color: #888; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Dates & Time</span><br/>
                <span style="color: #111; font-size: 16px; font-weight: 700; margin-top: 4px; display: block;">📅 ${start_date} to ${end_date}</span>
                <span style="color: #666; font-size: 14px; margin-top: 2px; display: block;">⏰ ${time_slot}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid #f0f0f0;">
                <span style="color: #888; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Estimated Budget</span><br/>
                <span style="color: #2563eb; font-size: 20px; font-weight: 800; margin-top: 4px; display: block;">₹${budget}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid #f0f0f0;">
                <span style="color: #888; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Vision & Requirements</span><br/>
                <span style="color: #333; font-size: 15px; font-weight: 500; margin-top: 8px; display: block; line-height: 1.6; background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #eee;">
                  ${vision_requirements}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid #f0f0f0;">
                <span style="color: #888; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Contact</span><br/>
                <span style="color: #111; font-size: 16px; font-weight: 700; margin-top: 4px; display: block;">${contact_details}</span>
              </td>
            </tr>
            ${image_url ? `
            <tr>
              <td style="padding: 14px 0;">
                <span style="color: #888; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Event Image</span><br/>
                <img src="${image_url}" alt="Event" style="margin-top: 12px; width: 100%; max-height: 240px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
              </td>
            </tr>` : ''}
          </table>
        </div>

        <!-- CTA -->
        <div style="background: #f8f9fa; padding: 28px 40px; text-align: center; border-top: 1px solid #eee;">
          <a href="https://uventerapp.vercel.app/admin" style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 15px; font-weight: 700; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
            Review in Admin Dashboard →
          </a>
          <p style="color: #aaa; font-size: 12px; margin: 16px 0 0;">Uventer · We Organizing</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Uventer Notifications" <${process.env.SMTP_USER}>`,
      to: 'digital@kitemediaconcept.com',
      subject: `🌟 New Event Submission: ${event_name}`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[notify-event] Email error:', err.message);
    // Don't fail the submission if email fails
    return NextResponse.json({ success: true, emailError: err.message });
  }
}

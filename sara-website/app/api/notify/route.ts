import { NextResponse } from "next/server";

/*
 * Email notification endpoint.
 *
 * To connect a real email provider:
 *   1. npm install resend          (or nodemailer, sendgrid, etc.)
 *   2. Add RESEND_API_KEY and NOTIFICATION_EMAIL to .env.local
 *   3. Replace the console.log below with the provider's send call.
 *
 * Example with Resend:
 *   import { Resend } from 'resend';
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.emails.send({
 *     from: 'Althouse Design <noreply@althousedesign.com>',
 *     to: process.env.NOTIFICATION_EMAIL!,
 *     subject: 'New subscriber',
 *     text: `New signup: ${email}`,
 *   });
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // TODO: replace with email provider
    console.log(`[Althouse Design] New subscriber: ${email}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

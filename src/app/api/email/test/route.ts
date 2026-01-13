import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET() {
  const result = await sendEmail({
    to: "andre@makersforge.gg",
    subject: "✅ MakersForge Email Test",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a1a; padding: 32px; border-radius: 12px;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0;">Email is Working! 🎉</h1>
          <p style="color: #999999; font-size: 14px; margin: 0 0 24px 0;">Your Resend integration is configured correctly.</p>
          <p style="color: #E8491F; font-size: 14px; margin: 0;">Sent at: ${new Date().toISOString()}</p>
        </div>
      </div>
    `,
  });

  if (result.success) {
    return NextResponse.json({ success: true, message: "Test email sent!" });
  } else {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }
}
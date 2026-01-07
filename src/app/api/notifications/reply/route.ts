import { NextRequest, NextResponse } from "next/server";
import { sendAdminReplyNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await sendAdminReplyNotification(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { notifyAdminNewMessage } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateName, candidateEmail, messagePreview, candidateId } = body;

    if (!candidateName || !candidateEmail || !messagePreview) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://makersforge.gg'}/admin/candidates/${candidateId}`;

    const result = await notifyAdminNewMessage({
      candidateName,
      candidateEmail,
      messagePreview: messagePreview.substring(0, 200) + (messagePreview.length > 200 ? '...' : ''),
      dashboardLink,
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Notify admin error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
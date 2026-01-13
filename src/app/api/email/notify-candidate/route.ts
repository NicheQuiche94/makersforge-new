import { NextRequest, NextResponse } from "next/server";
import { notifyCandidateProcessUpdate } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateName, candidateEmail, companyName, newStage } = body;

    if (!candidateName || !candidateEmail || !companyName || !newStage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://makersforge.gg'}/dashboard`;

    const result = await notifyCandidateProcessUpdate({
      candidateName,
      candidateEmail,
      companyName,
      newStage,
      dashboardLink,
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
  } catch (error) {
    console.error("Notify candidate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
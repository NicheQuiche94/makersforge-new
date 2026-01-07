import { NextRequest, NextResponse } from "next/server";
import { sendCandidateStatusUpdate } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await sendCandidateStatusUpdate(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
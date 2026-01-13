import { NextRequest, NextResponse } from "next/server";
import { notifyAdminNewQuote } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      companyName, 
      email, 
      permanentHires, 
      contractHires, 
      contractDuration, 
      totalQuote, 
      paymentPreference 
    } = body;

    if (!companyName || !email || totalQuote === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await notifyAdminNewQuote({
      companyName,
      email,
      permanentHires: permanentHires || 0,
      contractHires: contractHires || 0,
      contractDuration: contractDuration || 6,
      totalQuote,
      paymentPreference: paymentPreference || "single",
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Notify quote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
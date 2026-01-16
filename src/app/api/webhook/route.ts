// I have created a file with instructions on how to fix the OTP and email notification issue. You can find it at `docs/otp-and-email-fix-instructions.md`

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    const secret = "24672467"; // You make this up (e.g., "123456")

    // Verify the signal actually came from Razorpay
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      const event = JSON.parse(body);
      
      if (event.event === "payment.captured") {
        console.log("Payment Success! Order ID:", event.payload.payment.entity.order_id);
        // Database update logic would go here
        return NextResponse.json({ status: "success" }, { status: 200 });
      }
    }

    return NextResponse.json({ status: "invalid_signature" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
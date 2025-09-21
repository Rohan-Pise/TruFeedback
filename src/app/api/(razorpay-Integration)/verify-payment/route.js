// app/api/verify-payment/route.js
import crypto from "crypto";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import connectToDb from "../../../config/dbConnect";
import User from "../../../Models/UserModel";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import {transporter} from "../../../lib/mailer";



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    await connectToDb(); //  connect DB at start

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      await req.json();

    // 1) Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { ok: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    // 2) Fetch payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured") {
      return NextResponse.json(
        { ok: false, error: "Payment not completed" },
        { status: 400 }
      );
    }

    // 3) Get logged-in user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Not Authenticated Try after login" },
        { status: 401 }
      );
    }

    const userId = session.user?.id;
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ email: session.user.email });

    if (!user) {
      console.log("User not found for session:", session);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4) Update subscription status
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { isSubscribed: true ,
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(new Date().setMonth(new Date().getMonth() + 1))}, // 1 month subscription
      { new: true }
    );

    console.log("Subscription activated for user:", updatedUser);

    //Send confirmation email

    await transporter.sendMail({
      from:`Team TruFeedback <${process.env.MAIL_USER}>`,
      to:session?.user?.email,
      subject:"Payment Successfull - Subscription Activated 🎉",
      html:`
       <h2>Hi ${session?.user?.name || "User"},</h2>
    <p>Thank you for subscribing to <b>TrueFeedback PRO</b>.</p>
    <p>Your payment was successful and your subscription is now active ✅.</p>
    <p>Enjoy AI-powered insights!</p>
    <br/>
    <p>– The TruFeedback Team</p>
      `
    })

    // 5) Return response
    return NextResponse.json({
      ok: true,
      message: "Payment verified & subscription activated",
      payment,
      user: updatedUser,
    });
  } catch (err) {
    console.error("verify-payment error:", err);
    return NextResponse.json(
      { ok: false, error: "verify-payment did not worked" },
      { status: 500 }
    );
  }
}

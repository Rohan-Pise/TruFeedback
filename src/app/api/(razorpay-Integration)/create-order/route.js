import Razorpay from "razorpay";
import { NextResponse} from "next/server";

// creating instance with keys from .env
const razorpay = new Razorpay({
  key_id : process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req){
  try{
    const {amount} = await req.json();
    const amountInPaise = Math.round(Number(amount)*100);

    const options={
      amount:amountInPaise,
      currency:"INR",
      receipt:`rcpt_${Date.now()}`,
      payment_capture:1,
    };

    const order=await razorpay.orders.create(options);
    return NextResponse.json(order,{status:201});
  }catch(err){
    console.log("create-order error : ", err);
    return NextResponse.json({error:"Internal Server Error"},{status:500});
  }
}

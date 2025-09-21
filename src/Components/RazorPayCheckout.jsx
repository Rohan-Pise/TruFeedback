"use client";
import React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {Button} from  "@mui/material";

function loadRazorpayScript() {
  return new Promise((resolve)=>{
    if(typeof window === "undefined") return resolve(false);
    if(document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')){
      return resolve(true);
    }

    const script = document.createElement("script");
     script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);

  })
}

export default function RazorPayCheckout({amount , name="TruFeedback-Pro",
  description="Get more insights with AI-generated summaries for Rs.49/month",
}) {
  const {data:session,update} = useSession();
  const handlePayment=async ()=>{
    const ok = await loadRazorpayScript();
    if(!ok) return toast.error("RazorPay SDK failed to load");
 
    // Asking user to create order
    const createRes = await axios.post("/api/create-order",{amount});
    const order = createRes.data;

    // prepare checkout options
    const options={
    key : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount:order.amount.toString(),
    currency:"INR",
    name,
    description,
    order_id:order.id,
    handler: async function (response){
      try{
        const verifyRes = await axios.post("/api/verify-payment",{
          razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
        });

        if(verifyRes.data.ok){
          toast.success("Payment Successful")
          await update();
        }else{
          toast.error("Payment verification failed on server");
        }

      }catch(err){
        console.log(err);
        toast.error("Server error verifying payment");
      }
    },
    prefill:{
      name: session?.user.name,
      email: session?.user.email,

    },
    theme:{
      color:"#3399cc"
    } ,

    };

    const rzp = new window.Razorpay(options);
    rzp.open();



  };
  return(
    <Button onClick={handlePayment} 
     sx={{
            background: "linear-gradient(135deg, #FF6B6B, #FFD93D, #FF9F1C)",
            color: "#fff",
            fontWeight: "600",
            textTransform: "none",
            px: 3,
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundPosition: "100% 0",
              boxShadow: "0 6px 25px rgba(147, 51, 234, 0.5)",
            },
          }}>
      Get PRO Subscription
    </Button>
  )

}
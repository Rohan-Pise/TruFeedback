// import { getServerSession } from "next-auth/next";
import connectToDB from "../../../config/dbConnect";
import Feedback from "../../../Models/FeedbackModel";
import User from "../../../Models/UserModel";
// import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req){
  try{

    // const session = await getServerSession(authOptions);
    // if(!session){
    //   return new Response(JSON.stringify({error : "Please authenticate before using this route"} , {status:401}))
    // }

    const body = await req.json();
    const {userId , message} = body;

    if(!message || message.length >1500){
     return new Response(
  JSON.stringify({ error: "Message cannot be greater than 1500 chars" }),
  { status: 400 }
);

    }

    await connectToDB();

    const user = await User.findById(userId) ;

    if(!user){
      return new Response(JSON.stringify({error:"User not found"} , {status:401}))
    }

    if(!user.isAcceptingMessages){
      return Response.json({error : "User is Not accepting messages currently"},{status:403});

    }

    const feedback = await Feedback.create({
      user:user._id,
      message,
    });

    user.feedbacks.push(feedback._id);
await user.save();

    return new Response(JSON.stringify({feedback}) , {status:200,});


  }catch(err){
   console.log(err);
   return new Response(JSON.stringify({error:"Something went wrong"}), {status:500});
  }
}
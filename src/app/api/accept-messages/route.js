import {getServerSession} from "next-auth/next";
import { authOptions} from "../auth/[...nextauth]/route";
import connectToDB from "../../config/dbConnect";
import User from "../../Models/UserModel"
import {checkAndUpdateSubscription} from "../utils/subscription";

// Checks wehter the user is accepting messages or not
export async function GET(){
  const session=await getServerSession(authOptions);
  if(!session){
    return new Response(JSON.stringify({error:"Not authenticated"}) , {status:401});
  }

  await connectToDB();
  const userId = session?.user?.id;

  const user = userId ? await User.findById(userId) : await User.findOne({ email: session.user.email });

  if (!user) {
  return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
}

if (user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date()) {
  user.isSubscribed = false;
  await user.save(); // update DB
}


  return Response.json(
    { isAcceptingMessages: user.isAcceptingMessages },
    { status: 200 }
  );
}


// toggles the state of isAccepting messages
export async function POST(req){
  const session=await getServerSession(authOptions);
  if(!session){
    return new Response(JSON.stringify({error : "Did not got session please try after loggin in"} , {status:401}));
  }

  await connectToDB();
  const userId = session?.user?.id;

  const {isAcceptingMessages} = await req.json();


  const user = userId ? await User.findById(userId) : await User.findOne({email:session.user.email});

  if(!user){
    return new Response(JSON.stringify({error: "User not found"},{status:401}));
  }
  await checkAndUpdateSubscription(user);

  let response ;
   if (userId) {
  // if we have a MongoDB _id
  response = await User.findByIdAndUpdate(userId, {isAcceptingMessages}, { new: true });
} else if (session.user?.email) {
  // fallback: find by email
  response = await User.findOneAndUpdate(
    { email: session.user.email },
    req.body,
    { new: true }
  );
}

  return new Response(JSON.stringify({response : response},{status:200}));

}
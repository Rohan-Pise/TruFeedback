import connectToDB from "../../../config/dbConnect";
import { getServerSession } from "next-auth";
import Feedback from "../../../Models/FeedbackModel";
import User from "../../../Models/UserModel";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(){
  const session = await getServerSession(authOptions);
  if(!session){
    return Response.json(
      {error : "Not Authenticated Try after login"},{status:401}
    );
  }

await connectToDB();

//Get User
const userId = session.user?.id;
const user= userId ? await User.findById(userId) : await User.findOne({email:session.user.email});

if(!user){
  return new Response(JSON.stringify({
   error: "Not able to find user"
  },
{status:401}))
}

const feedbacks = await Feedback.find({user:user._id}).sort({createdAt:-1});

return Response.json(({feedbacks}), {status:200});


}
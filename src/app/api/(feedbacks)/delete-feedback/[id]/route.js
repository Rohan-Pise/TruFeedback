import connectToDB from "../../../../config/dbConnect";
import Feedback from "../../../../Models/FeedbackModel";
import { NextResponse } from "next/server";
import User from "../../../../Models/UserModel";

export async function DELETE(req,{params}){
  try{
    await connectToDB();
    const {id} = await params;
    const feedback = await Feedback.findById(id);
    if(!feedback){
      return NextResponse.json({error :"Feedback not found with given ID"}, {status:404});
    }

    // Delete the feedback
    await Feedback.findByIdAndDelete(id);

    //Remove feedback reference from User model
    await User.findByIdAndUpdate(feedback.user,{$pull :{feedbacks:id}});

    return NextResponse.json({message:"Feedback deleted Successfully"})


  }catch(err){
    console.error("unable to delete feddback: ", err)
    return NextResponse.json({error:"Unable to delete"}, {status:500});
  }
}


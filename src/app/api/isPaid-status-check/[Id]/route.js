import User from "../../../Models/UserModel";
import connectToDB from "../../../config/dbConnect";
import { NextResponse } from "next/server";

// GET /api/user/[id]
export async function GET(req, { params }) {
  await connectToDB();

  try {
    const { Id } = await params; 
    const user = await User.findById(Id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if subscription is expired
    let isSubscribed = user.isSubscribed;
    if (user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date()) {
      isSubscribed = false;
      user.isSubscribed = false;
      await user.save(); // auto-update subscription status
    }

    return NextResponse.json(
      {
        isSubscribed,
        isAcceptingMessages: user.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error checking paid status:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

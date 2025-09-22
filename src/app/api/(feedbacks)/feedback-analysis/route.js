// Endpoint for performing sentiment analysis 
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "../../../Models/UserModel";
import Feedback from "../../../Models/FeedbackModel";
import connectToDB from "../../../config/dbConnect";
import { getServerSession } from "next-auth";
import Groq from "groq-sdk";


const groq = new Groq({
  apiKey: process.env.GROK_API_KEY,
});


export async function GET(){
  const session = await getServerSession(authOptions);
  if(!session){
    return Response.json(
      {error: "Cannot found the user Please try after login"},
      {status:401}
    )
  }

  const userId = session?.user?.id;
  await connectToDB();
  
 const user =  userId ? await User.findById(userId) : await User.findOne({email:session?.user?.email});

 if(!user){
  return new Response(JSON.stringify({
   error: "Not able to find user"
  },
{status:401}))
}



console.log(user);
if(!user.isSubscribed || new Date(user.subscriptionEnd) < new Date()){
  return Response.json({Error : "User is not Subscribed to use this service"});
}

const feedbacks = await Feedback.find({user:user._id}).sort({createdAt:-1})
let feedBackFormattedForAI = feedbacks.map(fb=>fb.message).join("&&");

const prompt=`
You are a sentiment analysis assistant. You are taking feedbacks/messages from anonymous users analyzing it and providing summary of those feedback to the user receiving message / feedbacks
Please Note : anonymous user might give feedback in Hinglish , Marathi , Hindi or in short forms like "gr8" for great etc. So please consider that while analyzing the sentiment
Here is the list of messages from user: ${feedBackFormattedForAI}
Different feedbacks are separated using '&&' but there can be only one feedback also in that case you will not get '&&'.
You need to analyze the overall sentiment of all feedbacks and provide a unified reponse based on all feedbacks .

Your task:
1. Analyze the overall sentiment (positive, neutral, negative).
2. Identify the main themes or issues from all feedbacks based on urgency and importance.
3. Provide a very short summary of the overall feedbacks (1–2 sentences).

IMPORTANT: Return the result strictly in this format (no extra text, no explanation, no JSON ) :
overallSentiment(comma seperated)&&themes(comma separated)&&summary
Example : "Positive&&motivation,encouragement&&you're receiving overwhelmingly positive encouragement from the user to continue doing well
Please Note : 
1.Do not start conversation with every request you only need to give the response as mentioned in IMPORTANT section Example above
2.You are not supposed to Answer the questions in feedbacks you just need to analyze the sentiment and give summary as mentioned above
3.You are not supposed to add "overallSentiment: " , "themes:" , "summary:" before the respective answers
`
 const result =await groq.chat.completions.create({
  model:"llama-3.1-8b-instant",
  messages:[{role:"system", content:prompt}],
  temperature: 0
 })

 try{
  let rawAnalysis = (result.choices[0]?.message?.content || "");
 const responseArray = rawAnalysis.split("&&");
 return Response.json({overallSentiment : responseArray[0] , 
  themes:responseArray[1],summary:responseArray[2]});
 }catch(err){
  console.error("error getting resopnse from AI", err);
 }

 


}
//import OpenAI from "openai";
import Groq from "groq-sdk";
import { authOptions } from "../auth/[...nextauth]/route";
import Feedback from "../../Models/FeedbackModel";
import User from "../../Models/UserModel";
import connectToDB from "../../config/dbConnect";
import { getServerSession } from "next-auth";

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_KEY,
// });

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY,
});

export async function GET(req){
  try{
    const prompt= "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be seperated by '||'. These questions are for anonymous social messaging platform , like Qooh.me , and should be suitable for diverse audience. Avoid personal or sensitive topics , focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this : 'whats a hobby you have recently started ?||If you could have dinner with a historical figure , who would it be?||What is a simple thing that makes you happy?'. ensure the questions are intriguing, foster curiosity , and contribute to a positive and welcoming conversational environment. also make sure it is not more than 1200 characters including spaces and it should use simple English words which can be easily understandable to all";

  const result = await groq.chat.completions.create({
    model:"llama-3.1-8b-instant",
    messages:[{role:"user" , content:prompt}],
  })

  let suggestions;

    suggestions = result.choices[0].message.content;
    const SuggestionArray = suggestions.split("||")


    return  Response.json(({SuggestionArray}),{status:200});
  


  }catch(err){
    console.log(err);
    return new Response(JSON.stringify({error : "Something went wrong"}), {status:500});
  }
}


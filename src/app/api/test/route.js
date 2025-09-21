import connectToDB from "../../config/dbConnect";


export async function GET(){
  await connectToDB();
  return new Response("Hey there Did you connect to DB ? ");
}
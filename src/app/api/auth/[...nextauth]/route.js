import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../Models/UserModel";
import connectToDB from "../../../config/dbConnect";

export const authOptions={
  providers:[
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  session:{
    strategy:"jwt",
  },

callbacks:{
  async signIn({user, account}){
    try{
      
     await connectToDB();
     const existingUser = await User.findOne({email : user.email});

     if(!existingUser){
      await User.create({
        name: user.name,
        email:user.email,
        image:user.image,
        provider:account?.provider || 'google',
      });
     }

     return true; //allowed SignIn


    }catch(err){
  
    console.error("signIN callback error : " , err);
    return false; //block signin on error

    }
  },

async jwt({ token, user }) {
  try {
    // If user just signed in, set base info
    if (user) {
      token.email = user.email;
    }

    await connectToDB();
    const dbUser = await User.findOne({ email: token.email });

    if (dbUser) {
      token.id = dbUser._id.toString();
      token.email = dbUser.email;
      token.name = dbUser.name;
      token.role = dbUser.role;
      token.isSubscribed = dbUser.isSubscribed;
      token.isAcceptingMessages = dbUser.isAcceptingMessages;
    }
  } catch (err) {
    console.error("JWT callback error: ", err);
  }

  return token;
},


 async session({session , token}){

  
     session.user.id = token.id;
   session.user.email=token.email;
   session.user.name=token.name;
   session.user.role=token.role;
   session.user.isSubscribed=token.isSubscribed;
   session.user.isAcceptingMessages=token.isAcceptingMessages;
  
  
return session;
  
 }

},


};

const handler = NextAuth(authOptions);
export {handler as GET , handler as POST};
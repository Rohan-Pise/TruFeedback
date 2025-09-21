import mongoose from  "mongoose";
const mongo_URI = process.env.MONGO_URL;

if(!mongo_URI){
  throw new Error("Please define Mongo DB connection URL in .env file ")
}

let cached = global.mongoose;

if(!cached){
  cached = global.mongoose={conn:null , promise:null};
}

async function connectToDB(){
  if(cached.conn){
    console.log("Connected to DB through cached connection");
    return cached.conn;
  }
  if(!cached.promise){
    cached.promise=mongoose.connect(mongo_URI)
    .then((mongoose)=>{
      console.log("Connected to mongoDB");
      return mongoose;
    }).catch(err=>{
      console.log("Error connecting to DB")
    })
  }
  cached.conn=await cached.promise;
  return cached.conn;
}

export default connectToDB;
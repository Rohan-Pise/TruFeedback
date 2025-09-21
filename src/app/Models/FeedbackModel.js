import mongoose ,{Schema} from 'mongoose';
const FeedbackSchema=new Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  message:{
    type:String,
    required:true,
    maxlength:1500
  },
},
{timestamps:true}
);

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback" , FeedbackSchema);
export default Feedback;
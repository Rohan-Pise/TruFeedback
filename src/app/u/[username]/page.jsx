"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import toast from "react-hot-toast";
const UserMessagingPage = ({ params }) => {
  const {
    register,
    handleSubmit,
    formState: { errors , isSubmitting},
    reset,
    setValue,
  } = useForm();
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(null);
  const[openSuggestions,setOpenSuggestions]=useState(false);
  const[suggestions,setSuggestions]=useState([]);
  const { username } = React.use(params);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      console.log(`/api/isPaid-status-check/${username}`);
      const response = await axios.get(`/api/isPaid-status-check/${username}`);
      console.log("response", response.data);
      setIsSubscribed(response.data.isSubscribed);
      setIsAcceptingMessages(response.data.isAcceptingMessages);
      // console.log("isAcceptingMessages", response.data.isAcceptingMessages);
      // console.log("isSubscribed", response.data.isSubscribed);
    };
    checkSubscriptionStatus();
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log(data);
      if (isAcceptingMessages) {
        await axios.post("/api/send-feedback", {
          userId: username,
          message: data.message,
        });
        toast.success("Message Sent Successfully");
      } else {
        alert("User is not accepting messages currently");
        toast.error("User is not accepting messages currently");
      }

      reset();
    } catch (err) {
      
      toast.error("User might not accepting message at this moment, Please Refresh & Try again");
    }
  };

  const  handleClick= async()=>{
    try{
      const response = await axios.get("/api/message-suggestions");
      console.log("AI suggestions :", response.data);
      setSuggestions(response.data.SuggestionArray);
      setOpenSuggestions(true)
    }catch(err){
      console.error("Error fetching AI suggestions:", err);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center md:flex-row gap-4 mt-10">
        <form onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <div className="flex flex-col w-[80vw] mt-2">
          <input
            className="bg-white/10 backdrop-blur-md border border-white/30 rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition duration-200"
            {...register("message", {
              required: "Message is Required",
              maxLength: {
                value: isSubscribed ? 1500 : 400,
                message: isSubscribed
                  ? "Message cannot exceed 1500 characters"
                  : "Message cannot exceed 400 characters",
              },
              minLength: {
                value: 10,
                message: "Message should be atleast 10 characters long",
              },
              pattern: {
                value: /^(?=.*[a-zA-Z]).+$/,
                message: "Message must not contain only number or special character or combination of them it must contain some meaningfull words",
              },
            })}
            placeholder={`You can write your message Here ....`}
          />
          {errors.message && (
            
            <p className="text-red-400 text-sm mt-2 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md border border-red-400/30">{errors.message.message}</p>
         
          )}
          </div>
         
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 mt-2
                ${isAcceptingMessages
      ? "bg-white/10 text-white backdrop-blur-md border border-white/30 hover:bg-white/20 hover:border-white/40"
      : "bg-white/10 text-white/50 backdrop-blur-md border border-white/20 cursor-not-allowed"
    }`}

            disabled={!isAcceptingMessages || isSubmitting}
          >
            {isAcceptingMessages ? isSubmitting? "Submitting...": "Send Message" : "Messages Disabled"}
          </button>
        </form>
      </div>
      <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center mt-4">
         <button className="rounded-lg p-4 mt-4 text-white font-semibold bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 hover:border-white/40 transition-all duration-200"
         onClick={handleClick}
         >
          Generate Suggestions using AI ✨
          </button>
          <div className="flex flex-col justify-center sm:flex sm:flex-row sm:flex-wrap sm:justify-start w-full m-4 p-2 ">
          {openSuggestions && suggestions.length>0 && 
          (
            suggestions.map((suggestion,idx)=>(
              <Card key={idx} className="sm:w-[25vw] m-2 cursor-pointer hover:scale-105 transition-transform duration-200 "
              sx={{
                          
                          marginBottom: 2,
                          position: "relative",
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                          borderRadius: "1rem",
                        }}
              onClick={()=>{
                setValue("message",suggestion);
                setOpenSuggestions(false);
              }}>
              <CardContent>
                {suggestion}
              </CardContent>
            </Card>
            ))
          )
          }
          </div>
      </div>
      </div>
    </div>
  );
};

export default UserMessagingPage;

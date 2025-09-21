"use client";
import {Button,Box} from "@mui/material";
import  { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import toast from "react-hot-toast";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { IOSSwitch } from "../../Components/Ios-Switch";
import { motion } from "framer-motion";
import { TbRefresh } from "react-icons/tb";
import PopUp from "../../Components/DialogBox";
import axios from "axios";
import { useSession } from "next-auth/react";

function DashBoard() {
  const { data: session, update } = useSession();
  const [switchState, setSwitchState] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [aiSummary, setAiSummary] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);


  async function fetchSwitchState() {
    try {
      const response = await axios.get("/api/accept-messages");
      const isAccepting = response.data.isAcceptingMessages;
      setSwitchState(isAccepting);
      console.log("API response:", isAccepting);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Update DB when switch is toggled
  async function handleSwitchChange(event) {
    const newState = event.target.checked;
    setSwitchState(newState); // Optimistically update UI
    toast.success(
      newState
        ? "You are now accepting messages"
        : "You are not accepting messages"
    );

    try {
      await axios.post("/api/accept-messages", {
        isAcceptingMessages: newState,
      });
      await update();
      // Optionally, refetch state from server here if needed
    } catch (error) {
      console.error("Failed to update state in DB:", error);
      setSwitchState(!newState); // Revert UI if API fails
    }
  }

  //Get the AI generated Summary
  async function handleAIButtonClick() {
    try {
      if (!session?.user.isSubscribed) {
        setOpenPopup(true);
      }
      const response = await axios.get("/api/feedback-analysis");
      setAiSummary(response.data);
      setShowSummary(true);
    } catch (err) {
      console.error("Error fetching AI summary", err);
    }
  }

  //Delete feedback
  const handleDelete = async (feedbackId) => {
    try {
      await axios.delete(`/api/delete-feedback/${feedbackId}`);
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== feedbackId));
      toast.success("Feedback Deleted Successfully");
    } catch (err) {
      console.log("Error deleting feedback:", err);
      toast.error("failed to delete feedback");
    }
  };

  async function fetchFeedbacks() {
    try {
      const response = await axios.get("/api/get-feedbacks");
      console.log("feedbacks:", response.data.feedbacks);
      setFeedbacks(response.data.feedbacks);
    } catch (err) {
      console.error("Error fetching feedbacks;", err);
    }
  }

  const userId = session?.user.id;
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = `${baseUrl}/u/${userId}`;

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard");
  };

  useEffect(() => {
    fetchSwitchState();
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    console.log("SwitchState updated:", switchState);
  }, [switchState]);

  return (
    <div>
      <main>
        {session && (
          <div className=" container mx-auto display-flex flex-column align-items-center justify-content-center  p-2  text-black">
            {/* Card like UI for switch and URL copy */}
            {/* Glassmorphism effect using Tailwind CSS */}
            {/* <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-md w-full m-2"> */}
            <motion.div
              className="w-full"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="container mx-auto p-4 flex justify-center">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg text-white w-full max-w-2xl border border-white/30 space-y-6">
                  {/* Card Header */}
                  <Typography
                    variant="h6"
                    className="text-center font-semibold tracking-wide"
                  >
                    Welcome to DashBoard, {session?.user?.name}
                  </Typography>

                  {/* Accepting Messages Section */}
                  <div className="flex flex-col md:flex-row sm:justify-between md:items-center gap-2 bg-white/10 p-4 rounded-xl">
                    <h3 className="text-sm md:text-base font-medium">
                      Accepting Anonymous Messages
                    </h3>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          checked={switchState}
                          onChange={handleSwitchChange}
                        />
                      }
                      label=""
                    />
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/30" />

                  {/* Copy URL Section */}
                  <div className="space-y-2">
                    <Typography variant="body1" className="font-medium">
                      Your Unique Feedback URL
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      <input
                        className="bg-white/20 text-white rounded-xl px-3 py-2 w-[300px] max-w-full border border-white/30 backdrop-blur-sm"
                        type="text"
                        value={profileUrl}
                        readOnly
                      />
                      <Button
                        variant="contained"
                        onClick={copyToClipBoard}
                        disabled={!switchState}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          color: "#ffffff",
                          backdropFilter: "blur(6px)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          borderRadius: "0.75rem",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                          },
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

              
            <div className="  flex flex-col  items-center m-2 gap-4 rounded-lg sm:flex-row sm:gap-2.5 ">
              {/* Looping the feddbacks and rendering them on UI */}

              <div className=" relative h-[75vh] overflow-y-auto bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4  flex flex-col items-center w-full sm:w-[60%] lg:w-[70%] sm:p-2 order-2 sm:order-1 ">
                <div className="fixed top-4 left-1 z-50 p-1 bg-white/20 backdrop-blur-md rounded-full cursor-pointer hover:scale-110 transition-transform duration-300">
                  <TbRefresh size={24} color="white" onClick={fetchFeedbacks} />
                </div>
                {feedbacks && feedbacks.length > 0 ? (
                  (console.log("feedbacks:", feedbacks),
                  feedbacks.map((feedback) => (
                    <motion.div
                      className="w-[90%] pt-2"
                      key={feedback._id}
                      animate={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <Card
                        className="flex justify-between w-full  p-6 shadow-lg "
                        key={feedback._id}
                        sx={{
                          minWidth: 275,
                          marginBottom: 2,
                          position: "relative",
                          width: "100%",
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                          borderRadius: "1rem",
                        }}
                      >
                        {/* Delete Button */}
                        <CardContent>
                          <Typography variant="h6" sx={{
                            color:"white",
                            opacity:"80%",
                            wordBreak: "break-word" // prevent overflow on long feedback messages
                          }}>
                            {feedback.message}{" "}
                            {/* Replace with your feedback message */}
                          </Typography>
                          <Typography sx={{

                          }}
                            variant="body" color="text.secondary">
                            {new Date(feedback.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </Typography>
                        </CardContent>
                        <div className=" flex flex-col p-1">
                          <IconButton
                            className="self-start"
                            size="small"
                            onClick={() => handleDelete(feedback._id)}
                            sx={{
                              backgroundColor: "red",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "darkred",
                              },
                              borderRadius: "4px", // makes it a square
                              width: "28px",
                              height: "28px",
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </Card>
                    </motion.div>
                  )))
                ) : (
                  <div className=" m-auto font-bold text-fuchsia-50 opacity-80 text-3xl p-5 rounded">You have not reeceived any Feedback Yet ! </div>
                )}
              </div>
              <div className=" bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 flex flex-col gap-2 items-center lg:w-[30%] order-1 sm:order-2 sm:h-[75vh] sm:w-[40%] ">
                <div>
                  <Button
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(135deg, #06b6d4, #3b82f6, #9333ea)", // cyan → blue → purple
                      color: "#fff",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                      textTransform: "none",
                      padding: "10px 20px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                      backgroundSize: "200% 200%", // for hover animation
                      transition: "all 0.4s ease",
                      "&:hover": {
                        backgroundPosition: "100% 0", // shift gradient
                        boxShadow: "0 6px 25px rgba(147, 51, 234, 0.5)", // purple glow
                      },
                      "&:disabled": {
                        background: "rgba(255, 255, 255, 0.15)",
                        color: "rgba(255, 255, 255, 0.6)",
                        boxShadow: "none",
                      },
                    }}
                    disabled={feedbacks.length === 0}
                    onClick={handleAIButtonClick}
                  >
                    🚀 Get AI Summary
                  </Button>
                  <PopUp
                    open={openPopup}
                    onClose={() => setOpenPopup(false)}
                    title="🔒 Restricted Feature"
                    content={
                      <div>
                        You need a <strong>PRO Subscription</strong> to use AI
                        Summary.
                        <br />
                        Upgrade now and unlock:
                        <ul className="list-disc pl-5 mt-2 text-sm">
                          <li>Unlimited AI summaries</li>
                          <li>Basic AI based Sentiment analysis</li>
                          <li>Audience will be able to write long & descriptive feedbacks</li>
                          <li>Increased Mesaage Limit</li>
                        </ul>
                      </div>
                    }
                    cancelText="Maybe Later"
                    actionText="Upgrade Now 🚀"
                  />
                </div>
                <div>
                  {showSummary && (
                    <Card
                      sx={{
                        width: "100%",
                        maxWidth: { xs: "100%", sm: "600px", md: "800px" }, // responsive max width
                        margin: "auto", // center on larger screens
                        marginBottom: 2,
                        position: "relative",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "1rem",
                        p: { xs: 2, sm: 3 }, // responsive padding
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        {/* Title */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: { xs: "1rem", sm: "1.25rem" }, // responsive font size
                            fontWeight: "bold",
                            textAlign: "center",
                            background:
                              "linear-gradient(90deg, #FFD700, #FFA500, #FF8C00)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          ✨ AI Summary
                        </Typography>

                       {/** Responsive info blocks **/}
    {[
      { label: "Overall Sentiment", value: aiSummary.overallSentiment },
      { label: "Themes", value: aiSummary.themes },
      { label: "Summary", value: aiSummary.summary },
    ].map((item) => (
      <Typography
        key={item.label}
        variant="body2"
        sx={{
          color: "white",
          opacity: 0.8,
          fontSize: { xs: "0.9rem", sm: "1rem" },
          wordBreak: "break-word", // prevent overflow on long text
        }}
      >
        <Box
          component="span"
          sx={{
            backgroundColor: "#FFA500",
            color: "black",
            px: 0.5,
            py: 0.25,
            borderRadius: 1,
            mr: 0.5,
            fontWeight: "bold",
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
          }}
        >
          {item.label}
        </Box>
        : {item.value}
      </Typography>
    ))}
  </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashBoard;

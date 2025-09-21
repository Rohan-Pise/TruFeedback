

import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
export default function LoginCard(){
  return(
  //  <Box className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-600"
  //  display="flex"
  //  justifyContent='center'
  //  alignItems='center'
  //  bgcolor='#f5f5f5'>

<div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-md w-full m-2">
    <Card 
     sx={{
    backgroundColor: "transparent", // allow Tailwind bg to show
    boxShadow: "none", // use Tailwind shadow
    borderRadius: "16px", // keep consistent with rounded-2xl
  }}>
        <CardContent>
          <Typography
          sx={{
             color: "#ffffff",
             opacity:"80%"
          }}
            variant="h5"
            component="div"
            gutterBottom
            textAlign="center"
          >
            Welcome Back 👋
          </Typography>
          <Typography
          sx={{
            color: "#ffffff",
            opacity:"80%"
          }}
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            Please sign in with your Google account to continue
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Button 
          sx={{
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
  }}

          variant="contained"
          startIcon={<GoogleIcon/>}
          onClick={()=>signIn("google")}
          >
            Sign in with Google
            </Button>
        </CardActions>
      </Card>
      </div>
    // </Box>
  

  )
}
"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useSession, signOut, signIn } from "next-auth/react";
import { Button } from "@mui/material";
import RazorPayCheckout from "./RazorPayCheckout";
import PopUp from "./DialogBox";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  React.useEffect(()=>{
   if(session?.user?.isSubscribed){
    setOpenDialog(false);
   }
  },[session?.user?.isSubscribed])

  const handleClick = () => {
    setOpenDialog(true);
  };

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <div className="bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-600 "> */}

      <AppBar
        className="rounded-lg"
        position="fixed"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TruFeedback
            {session?.user?.isSubscribed ? "-Pro" : ""}
          </Typography>
          {status === "authenticated" && (
            <div>
              {session?.user.isSubscribed ? (
                <Button
                  sx={{
                    background:
                      "linear-gradient(135deg, #FF6B6B, #FFD93D, #FF9F1C)",
                    color: "#fff",
                    fontWeight: 600,
                    textTransform: "none",
                    px: 3,
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundPosition: "100% 0",
                      boxShadow: "0 6px 25px rgba(147, 51, 234, 0.5)",
                    },
                  }}
                >
                  PRO
                </Button>
              ) : (
                <Button
                  sx={{
                    background:
                      "linear-gradient(135deg, #FF6B6B, #FFD93D, #FF9F1C)",
                    color: "#fff",
                    fontWeight: 600,
                    textTransform: "none",
                    px: 3,
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundPosition: "100% 0",
                      boxShadow: "0 6px 25px rgba(147, 51, 234, 0.5)",
                    },
                  }}
                  onClick={handleClick}
                >
                  Get PRO Subscription
                </Button>
              )}
              <PopUp
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="What You Get with PRO @ 25/- 🚀"
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
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
          {status !== "authenticated" && (
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
              onClick={() => signIn("google")}
            >
              Log-In
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {/* </div> */}
    </Box>
  );
}

"use client";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from "@mui/material";
import RazorPayCheckout from "./RazorPayCheckout";

export default function PopUp({
  open,
  onClose,

  title ,
  content ,
  cancelText ,
 
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          padding: "16px",
          color: "#fff",
        },
      }}
    >
      {/* Dynamic Title */}
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        {title}
      </DialogTitle>

      {/* Dynamic Content */}
      <DialogContent>
        <Box sx={{ textAlign: "center", fontSize: "0.95rem" }}>
          {content}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        {/* Cancel */}
        <Button
          onClick={onClose}
          sx={{
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.4)",
            textTransform: "none",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.25)",
            },
          }}
        >
          {cancelText}
        </Button>

        {/* Upgrade */}
        
       <RazorPayCheckout amount={1} onClick={onClose}/>
       
      </DialogActions>
    </Dialog>
  );
}

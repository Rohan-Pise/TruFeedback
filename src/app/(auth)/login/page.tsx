"use client";
import { signIn } from "next-auth/react";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={() => signIn("google")}
        >
          Login with Google
        </Button>
      </div>
    </div>
  );
}

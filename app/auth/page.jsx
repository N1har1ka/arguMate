"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseclient";
import { AppContext } from "@/context/AppContext";
import { LogIn } from "lucide-react";

const Login = () => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
      redirectTo: "http://localhost:3000/dashboard",
    },
    });
    if (error) {
      console.log("error", error.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-4 transition-colors duration-700 ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800"
          : "bg-gradient-to-br from-indigo-50 via-white to-indigo-100"
      }`}
    >
      <div
        className={`w-full max-w-md backdrop-blur-2xl rounded-3xl border px-10 py-4 shadow-2xl transition-all duration-500 ${
          isDark
            ? "bg-gray-900/70 border-gray-700 text-gray-100"
            : "bg-white/70 border-gray-200 text-gray-800"
        }`}
      >
        {/* Text Logo */}
        <div className="flex justify-center mb-2">
          <h1
            className={`text-4xl font-extrabold tracking-tight select-none ${
              isDark
                ? "bg-gradient-to-r from-indigo-400 to-indigo-600 text-transparent bg-clip-text"
                : "bg-gradient-to-r from-indigo-600 to-indigo-800 text-transparent bg-clip-text"
            }`}
          >
            ArguMate
          </h1>
        </div>

        {/* Subheading */}
        <p
          className={`text-center mb-1 text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Debate. Improve. Master communication.
        </p>

        {/* Illustration */}
        <div className="flex justify-center">
          <Image
            src="/login.png"
            alt="login"
            width={360}
            height={230}
            className="rounded-xl shadow-lg animate-fadeIn"
          />
        </div>

        {/* Headings */}
        <h2
          className={`text-3xl font-extrabold text-center mt-2 leading-snug ${
            isDark ? "text-indigo-400" : "text-indigo-700"
          }`}
        >
          Welcome Back
        </h2>

        <p
          className={`text-center mt-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Sign in to continue your AI-powered debating journey
        </p>

        {/* Login Button */}
        <Button
          onClick={signInWithGoogle}
          className={`w-full mt-1 py-5 font-semibold flex items-center justify-center gap-2 rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.04] ${
            isDark
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <LogIn size={20} />
          Login with Google
        </Button>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
        </div>

        {/* Footer Quote */}
        <p
          className={`text-xs italic text-center ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}
        >
          “Every great communicator started with one simple conversation.”
        </p>
      </div>
    </div>
  );
};

export default Login;

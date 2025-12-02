"use client";

import { useUser } from "@/app/provider";
import Image from "next/image";
import React, { useContext } from "react";
import { AppContext } from "@/context/AppContext";

const WelcomeContainer = () => {
  const { user } = useUser();
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  return (
    <div
      className={`
        rounded-2xl p-6 mb-6 flex items-center justify-between transition-all duration-500
        shadow-sm hover:shadow-md backdrop-blur-xl
        ${isDark ? "bg-gray-900/70 border border-gray-700" : "bg-white/80 border border-gray-200"}
      `}
    >
      {/* Left side */}
      <div>
        <h2
          className={`
            text-2xl font-extrabold tracking-tight 
            ${isDark
              ? "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"}
          `}
        >
          Welcome Back, {user?.name || "Guest"}
        </h2>

        <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          AI-Driven Debates, Hassle-free hiring
        </p>
      </div>

      {/* Profile Image */}
      {user?.picture ? (
        <div
          className={`
            w-12 h-12 rounded-full p-[2px] 
            ${isDark ? "bg-gradient-to-br from-indigo-500 to-purple-600" : "bg-gradient-to-br from-indigo-400 to-purple-500"}
          `}
        >
          <Image
            src={user.picture}
            alt="user-picture"
            width={48}
            height={48}
            className="rounded-full object-cover w-full h-full"
          />
        </div>
      ) : (
        <div
          className={`
            w-12 h-12 flex items-center justify-center rounded-full text-lg font-semibold
            ${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"}
          `}
        >
          ?
        </div>
      )}
    </div>
  );
};

export default WelcomeContainer;

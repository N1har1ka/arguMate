"use client";

import React, { useContext } from "react";
import { AppContext } from "@/context/AppContext";

const InterviewHeader = () => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  return (
    <div
      className={`
        p-4 shadow-sm border-b transition-colors duration-300 
        ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}
      `}
    >
      <h1
        className={`
          text-3xl font-extrabold tracking-tight select-none 
          bg-clip-text text-transparent cursor-pointer
          ${
            isDark
              ? "bg-gradient-to-r from-purple-400 to-indigo-300"
              : "bg-gradient-to-r from-indigo-600 to-purple-600"
          }
        `}
      >
        ArguMate
      </h1>
    </div>
  );
};

export default InterviewHeader;

"use client"
import React, { useContext } from "react";
import { Sparkles, MessageSquare, Mic } from "lucide-react";
import { AppContext } from "@/context/AppContext";

const Debate = () => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  return (
    <div
      className={`min-h-screen flex items-start justify-center pt-24 px-6 transition-colors duration-700 ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-gray-800"
      }`}
    >
      <div
        className={`max-w-3xl w-full rounded-2xl shadow-xl p-10 mt-8 text-center transition-all duration-500 ${
          isDark
            ? "bg-gray-900 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header Section */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div
            className={`p-4 rounded-full shadow-md ${
              isDark
                ? "bg-indigo-700/20 text-indigo-400"
                : "bg-indigo-100 text-indigo-600"
            }`}
          >
            <Mic size={32} />
          </div>
          <h1
            className={`text-3xl font-extrabold ${
              isDark ? "text-indigo-400" : "text-indigo-700"
            }`}
          >
            Debate with AI 🤖
          </h1>
          <p
            className={`text-base max-w-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Challenge yourself with engaging debates, enhance your reasoning
            skills, and grow into a confident speaker. Let’s see how strong your
            arguments are!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.03] ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            <MessageSquare size={18} />
            Start a Debate
          </button>

          <button
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.03] ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600"
                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
            }`}
          >
            <Sparkles size={18} />
            Learn Tips
          </button>
        </div>

        {/* Footer Quote */}
        <p
          className={`mt-10 italic text-sm ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}
        >
          “Debating is not about winning arguments — it’s about learning to
          think deeper.” 💭
        </p>
      </div>
    </div>
  );
};

export default Debate;

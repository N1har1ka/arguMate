"use client"
import React, { useContext } from "react";
import { ArrowRight } from "lucide-react";
import { AppContext } from "@/context/AppContext";

const HeroSection = () => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  return (
    <section
      className={`flex flex-col pt-10 items-center justify-center text-center min-h-[90vh] px-6 sm:px-12 transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-b from-indigo-50 via-white to-indigo-100 text-gray-900"
      }`}
    >
      {/* Title */}
      <h1
        className={`text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight transition-all duration-500 ${
          isDark ? "text-indigo-400" : "text-indigo-700"
        }`}
      >
        Welcome to <span className="text-indigo-500">ArguMate</span> 🤖💬
      </h1>

      {/* Subtitle */}
      <p
        className={`text-base sm:text-lg md:text-xl max-w-2xl mb-8 transition-all duration-500 ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Challenge your AI buddy in engaging debates, sharpen your fluency, and
        boost your confidence — all while having fun and learning!
      </p>

      {/* CTA Button */}
      <button
        className={`flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ${
          isDark
            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
      >
        Start Arguing Now <ArrowRight size={20} />
      </button>

      {/* Decorative gradient circle */}
      <div
        className={`absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-30 pointer-events-none ${
          isDark ? "bg-indigo-800" : "bg-indigo-300"
        }`}
      ></div>
    </section>
  );
};

export default HeroSection;

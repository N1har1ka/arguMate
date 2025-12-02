"use client"
import React, { useContext } from "react";
import { Brain, BookOpen, BarChart3 } from "lucide-react"; // ✅ Icons for features
import { AppContext } from "@/context/AppContext";

const Features = () => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  const features = [
    {
      title: "AI Debate Partner",
      desc: "Argue with a smart AI that adapts to your logic and vocabulary level.",
      icon: <Brain className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: "Vocabulary Boost",
      desc: "Learn new words and phrases naturally through real-time debates.",
      icon: <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: "Progress Tracking",
      desc: "Monitor how your fluency and confidence improve after each debate.",
      icon: <BarChart3 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
    },
  ];

  return (
    <section
      className={`py-20 px-6 text-center transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Heading */}
      <h2
        className={`text-3xl sm:text-4xl font-extrabold mb-12 transition-colors ${
          isDark ? "text-indigo-400" : "text-indigo-700"
        }`}
      >
        Why Choose ArguMate?
      </h2>

      {/* Features Grid */}
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {features.map((f, index) => (
          <div
            key={index}
            className={`rounded-2xl p-8 shadow-lg border transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
              isDark
                ? "bg-gray-800 border-gray-700 hover:border-indigo-500"
                : "bg-indigo-50 border-indigo-100 hover:border-indigo-300"
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              {f.icon}
              <h3
                className={`text-xl font-semibold transition-colors ${
                  isDark ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                {f.title}
              </h3>
              <p
                className={`text-sm sm:text-base max-w-xs ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative gradient element */}
      <div
        className={`absolute inset-x-0 -z-10 blur-3xl opacity-20 pointer-events-none ${
          isDark ? "bg-indigo-900" : "bg-indigo-300"
        } h-96 bottom-0`}
      ></div>
    </section>
  );
};

export default Features;

"use client"
import React, { useContext } from "react";
import { CheckCircle, Brain, MessageCircle, Sparkles } from "lucide-react"; // ✅ Icons
import { AppContext } from "@/context/AppContext";

const HowItWorks = () => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  const steps = [
    {
      title: "Create Your Profile",
      desc: "Sign up in seconds and personalize your debating profile.",
      icon: <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: "Choose a Topic",
      desc: "Select a debate topic or let AI suggest one that matches your interests.",
      icon: <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: "Start the Debate",
      desc: "Engage in a logical argument with our AI challenger that adapts to your level.",
      icon: <MessageCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: "Get Feedback",
      desc: "Receive instant feedback on your vocabulary, fluency, and argument clarity.",
      icon: <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    },
  ];

  return (
    <section
      className={`relative py-20 px-6 text-center transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-r from-indigo-50 via-white to-indigo-100 text-gray-900"
      }`}
    >
      {/* Section Heading */}
      <h2
        className={`text-3xl sm:text-4xl font-extrabold mb-12 ${
          isDark ? "text-indigo-400" : "text-indigo-700"
        }`}
      >
        How It Works
      </h2>

      {/* Steps Grid */}
      <div className="max-w-4xl mx-auto grid gap-6 sm:gap-8">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 p-5 sm:p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                : "bg-white hover:bg-indigo-50 border border-indigo-100"
            }`}
          >
            {/* Step Number or Icon */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 shadow-md ${
                isDark ? "bg-indigo-700" : "bg-indigo-600"
              }`}
            >
              <span className="text-white font-bold">{i + 1}</span>
            </div>

            {/* Step Text */}
            <div className="text-left flex-1">
              <div className="flex items-center gap-2 mb-1">
                {step.icon}
                <h3
                  className={`text-lg sm:text-xl font-semibold ${
                    isDark ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  {step.title}
                </h3>
              </div>
              <p
                className={`text-sm sm:text-base ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Background Glow */}
      <div
        className={`absolute inset-x-0 -bottom-12 h-96 blur-3xl opacity-20 pointer-events-none ${
          isDark ? "bg-indigo-900" : "bg-indigo-300"
        }`}
      ></div>
    </section>
  );
};

export default HowItWorks;

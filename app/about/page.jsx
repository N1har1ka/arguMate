"use client"
import React, { useContext } from "react";
import { Brain, Users, MessageSquare, Rocket } from "lucide-react";
import { AppContext } from "@/context/AppContext";

const About = () => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  const features = [
    {
      icon: <Brain size={28} />,
      title: "AI-Powered Debates",
      desc: "ArguMate’s intelligent AI analyzes your arguments, gives logical responses, and helps you think critically.",
    },
    {
      icon: <Users size={28} />,
      title: "Interactive Learning",
      desc: "Engage in realistic discussions to boost your fluency, reasoning, and English communication skills.",
    },
    {
      icon: <MessageSquare size={28} />,
      title: "Personalized Topics",
      desc: "Choose from various debate categories — from technology to ethics — that fit your interests.",
    },
    {
      icon: <Rocket size={28} />,
      title: "Progress Growth",
      desc: "Track your improvement in vocabulary and debate skills over time with AI-generated insights.",
    },
  ];

  return (
    <div
      className={`min-h-screen flex items-start justify-center pt-16 px-0 transition-colors duration-700 ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-gray-800"
      }`}
    >
      <div
        className={`max-w-5xl w-full text-center rounded-2xl shadow-xl p-5 mt-6 transition-all duration-500 ${
          isDark
            ? "bg-gray-900 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header Section */}
        <h1
          className={`text-4xl font-extrabold mb-3 ${
            isDark ? "text-indigo-400" : "text-indigo-700"
          }`}
        >
          About ArguMate 💬
        </h1>
        <p
          className={`text-base md:text-lg max-w-3xl mx-auto mb-10 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          ArguMate is your intelligent AI debate partner designed to make
          learning English, critical thinking, and public speaking engaging and
          effective — all through the art of structured debate.
        </p>

        {/* Features Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl shadow-md transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-lg ${
                isDark
                  ? "bg-gray-800 border border-gray-700 hover:bg-gray-750"
                  : "bg-indigo-50 border border-indigo-100 hover:bg-indigo-100"
              }`}
            >
              <div
                className={`flex justify-center mb-3 ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                {feature.icon}
              </div>
              <h3
                className={`font-semibold text-lg mb-2 ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Closing Section */}
        <p
          className={`mt-12 text-sm italic ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}
        >
          “The best way to master communication is to challenge your ideas.”
        </p>
      </div>
    </div>
  );
};

export default About;

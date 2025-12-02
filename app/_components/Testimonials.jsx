"use client"
import React, { useContext } from "react";
import { Quote } from "lucide-react";
import { AppContext } from "@/context/AppContext";

const Testimonials = () => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  const testimonials = [
    {
      name: "Riya Sharma",
      feedback:
        "ArguMate made speaking practice so fun! My vocabulary has improved a lot.",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    {
      name: "Aarav Mehta",
      feedback:
        "It feels like debating with a real person. The AI responses are very intelligent!",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      name: "Sophia D.",
      feedback:
        "Great for language learners. It corrected my grammar while keeping the debate exciting.",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ];

  return (
    <section
      className={`relative py-20 px-6 text-center transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-b from-white via-indigo-50 to-white text-gray-900"
      }`}
    >
      {/* Heading */}
      <h2
        className={`text-3xl sm:text-4xl font-extrabold mb-12 ${
          isDark ? "text-indigo-400" : "text-indigo-700"
        }`}
      >
        What Our Users Say
      </h2>

      {/* Testimonials Grid */}
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`relative rounded-2xl p-8 shadow-lg transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${
              isDark
                ? "bg-gray-800 border border-gray-700 hover:border-indigo-500"
                : "bg-white border border-indigo-100 hover:border-indigo-300"
            }`}
          >
            {/* Quote Icon */}
            <Quote
              size={32}
              className={`absolute top-4 left-4 opacity-20 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />

            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-16 h-16 rounded-full border-2 border-indigo-500 shadow-md"
              />
            </div>

            {/* Feedback */}
            <p
              className={`italic text-base mb-4 transition-colors ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              “{t.feedback}”
            </p>

            {/* Name */}
            <h4
              className={`font-semibold text-lg ${
                isDark ? "text-indigo-300" : "text-indigo-700"
              }`}
            >
              {t.name}
            </h4>
          </div>
        ))}
      </div>

      {/* Decorative Glow */}
      <div
        className={`absolute inset-x-0 -bottom-10 h-96 blur-3xl opacity-20 pointer-events-none ${
          isDark ? "bg-indigo-900" : "bg-indigo-300"
        }`}
      ></div>
    </section>
  );
};

export default Testimonials;

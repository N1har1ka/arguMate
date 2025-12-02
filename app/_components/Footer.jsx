"use client"
import React, { useContext } from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { AppContext } from "@/context/AppContext";

const Footer = () => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  return (
    <footer
      className={`py-6 px-4 text-center transition-colors duration-500 ${
        isDark
          ? "bg-gray-900 text-gray-300 border-t border-gray-700"
          : "bg-indigo-700 text-white border-t border-indigo-800"
      }`}
    >
      {/* Top Section - Social Links */}
      <div className="flex justify-center gap-4 mb-3">
        {[
          { icon: <Github size={20} />, link: "https://github.com/" },
          { icon: <Twitter size={20} />, link: "https://twitter.com/" },
          { icon: <Linkedin size={20} />, link: "https://linkedin.com/" },
          { icon: <Mail size={20} />, link: "mailto:support@argumate.com" },
        ].map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-transform transform hover:scale-110 ${
              isDark ? "text-indigo-400 hover:text-indigo-300" : "text-white"
            }`}
          >
            {item.icon}
          </a>
        ))}
      </div>

      {/* Brand & Description */}
      <h2
        className={`text-xl font-semibold mb-1 ${
          isDark ? "text-indigo-400" : "text-white"
        }`}
      >
        ArguMate 💬
      </h2>
      <p
        className={`text-xs sm:text-sm max-w-md mx-auto leading-snug ${
          isDark ? "text-gray-400" : "text-indigo-100"
        }`}
      >
        Practice. Debate. Grow. Empower your voice with AI-driven debates and
        build confidence — one argument at a time.
      </p>

      {/* Bottom Line */}
      <p
        className={`text-[11px] sm:text-xs mt-4 ${
          isDark ? "text-gray-500" : "text-indigo-200"
        }`}
      >
        © {new Date().getFullYear()} ArguMate. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

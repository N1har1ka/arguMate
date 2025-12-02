"use client";
import React, { useContext } from "react";
import { AppContext } from "@/context/AppContext";

const QuestionListContainer = ({ questionList }) => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  return (
    <div
      className={`transition-colors duration-300 ${
        isDark ? "text-gray-100" : "text-gray-900"
      }`}
    >
      <h2 className="font-bold text-xl mb-5">Generated Debate Points</h2>

      <div
        className={`
          p-5 rounded-2xl border transition-all duration-300
          ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"}
        `}
      >
        {questionList.map((item, index) => (
          <div
            key={index}
            className={`
              p-4 rounded-xl mb-4 transition-all duration-300
              border shadow-sm 
              ${
                isDark
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }
            `}
          >
            {/* Debate Point */}
            <h2
              className={`font-medium text-[15px] leading-relaxed ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {item.point || item.question}
            </h2>

            {/* Badge */}
            <span
              className={`
                inline-flex mt-3 px-3 py-1 text-xs font-semibold rounded-full 
                transition-colors duration-300
                ${
                  item.type === "For"
                    ? isDark
                      ? "bg-green-900 text-green-300"
                      : "bg-green-100 text-green-700"
                    : item.type === "Against"
                    ? isDark
                      ? "bg-red-900 text-red-300"
                      : "bg-red-100 text-red-700"
                    : item.type === "Rebuttal"
                    ? isDark
                      ? "bg-purple-900 text-purple-300"
                      : "bg-purple-100 text-purple-700"
                    : isDark
                    ? "bg-blue-900 text-blue-300"
                    : "bg-blue-100 text-blue-700"
                }
              `}
            >
              {item.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionListContainer;

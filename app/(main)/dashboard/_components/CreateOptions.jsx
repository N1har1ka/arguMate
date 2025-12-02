"use client";

import { Phone, Video } from "lucide-react";
import Link from "next/link";
import React, { useContext } from "react";
import { AppContext } from "@/context/AppContext";

const CreateOptions = () => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
      {/* Create New Debate */}
      <Link
        href="/dashboard/create-interview"
        className={`
          rounded-xl px-5 py-6 border flex flex-col gap-3 shadow-sm transition-all duration-300
          hover:shadow-lg hover:-translate-y-1 cursor-pointer
          ${
            isDark
              ? "bg-gray-900/70 border-gray-700 hover:bg-gray-900"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }
        `}
      >
        <Video
          className={`
            p-3 rounded-lg h-12 w-12
            ${
              isDark
                ? "bg-indigo-900/30 text-indigo-300"
                : "bg-blue-50 text-indigo-600"
            }
          `}
        />

        <h2
          className={`font-bold text-lg ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Create New Debate
        </h2>

        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Create AI debates and schedule them with candidates.
        </p>
      </Link>

      {/* Phone Screening */}
      <div
        className={`
          rounded-xl px-5 py-6 border flex flex-col gap-3 shadow-sm transition-all duration-300
          hover:shadow-lg hover:-translate-y-1 cursor-pointer
          ${
            isDark
              ? "bg-gray-900/70 border-gray-700 hover:bg-gray-900"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }
        `}
      >
        <Phone
          className={`
            p-3 rounded-lg h-12 w-12
            ${
              isDark
                ? "bg-indigo-900/30 text-indigo-300"
                : "bg-blue-50 text-indigo-600"
            }
          `}
        />

        <h2
          className={`font-bold text-lg ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Phone Screening Call
        </h2>

        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Schedule phone screening calls with candidates.
        </p>
      </div>
    </div>
  );
};

export default CreateOptions;

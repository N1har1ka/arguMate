"use client";

import { useContext } from "react";
import DashboardProvider from "./provider";
import { AppContext } from "@/context/AppContext";

const DashboardLayout = ({ children }) => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  return (
    <div
      className={`
        min-h-screen transition-colors duration-500
        ${isDark ? "bg-gray-950" : "bg-gray-100"}
      `}
    >
      <DashboardProvider>
        <div className="px-6 sm:px-6 ">{children}</div>
      </DashboardProvider>
    </div>
  );
};

export default DashboardLayout;

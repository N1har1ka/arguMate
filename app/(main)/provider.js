"use client";

import { useContext, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";
import WelcomeContainer from "./dashboard/_components/WelcomeContainer";
import { AppContext } from "@/context/AppContext";
import { Sun, User, ArrowRight, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseclient";
import { useUser } from "../provider";

const DashboardProvider = ({ children }) => {
  const { mode, setMode } = useContext(AppContext);
  const isDark = mode === "dark";
  const router = useRouter();

  const toggleMode = () => {
    const newMode = isDark ? "light" : "dark";
    setMode(newMode);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", newMode === "dark");
    }
  };
  const { user } = useUser();

  // 🔐 Redirect if user not logged in
  useEffect(() => {
    if (user === undefined) return; // still loading
    if (!user) {
      router.push("/auth"); // or "/auth"
    }
  }, [user]);

  const goToProfile = () => router.push("/dashboard/settings");
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    // make this container `relative` so absolute toolbar can be anchored to it
    <div
      className={`relative min-h-screen flex transition-colors duration-500 ${
        isDark ? "bg-gray-950 text-gray-200" : "bg-gray-100 text-gray-900"
      }`}
    >
      <SidebarProvider >
  <AppSidebar  />

  <div className="flex-1 flex flex-col">

    {/* TOP RIGHT ICON BAR */}
    {/* Top-right toolbar */}
<div
  className={`p-4 border-b border-gray-700/40 flex justify-between  items-center gap-4 transition-colors duration-300`}
>
  {/* Sidebar Toggle */}
  <div>
    <SidebarTrigger
    className={`cursor-pointer w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200
      ${isDark ? "bg-gray-800 text-gray-100 hover:bg-gray-700" : "bg-white text-gray-800 hover:bg-gray-50"}
    `}
  />
  </div>

  <div className="flex gap-2">
  {/* Theme toggle */}
<button
  onClick={toggleMode}
  title={isDark ? "Switch to light mode" : "Switch to dark mode"}
  className="
    cursor-pointer w-10 h-10 rounded-full flex items-center justify-center 
    shadow-md transition-all duration-200
    bg-white text-gray-800 hover:bg-gray-50
    dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700
  "
>
  {isDark ? (
    <Sun size={18} className="text-yellow-300" />
  ) : (
    <Moon size={18} className="text-gray-700" />
  )}
</button>


  {/* Profile */}
  <button
    onClick={goToProfile}
    title="Profile"
    className={`cursor-pointer w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200
      ${isDark ? "bg-gray-800 text-gray-100 hover:bg-gray-700" : "bg-white text-gray-800 hover:bg-gray-50"}
    `}
  >
    <User size={18} />
  </button>

  {/* Sign out */}
  <button
    onClick={signOut}
    title="Sign out"
    className={`cursor-pointer w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200
      ${isDark ? "bg-red-700/90 text-white hover:bg-red-700" : "bg-red-50 text-red-600 hover:bg-red-100"}
    `}
  >
    <ArrowRight size={18} />
  </button>
  </div>
</div>


    {/* Welcome */}
    <div className="px-6 pt-2">
      <WelcomeContainer />
    </div>

    {/* Main dashboard content */}
    <div className="">{children}</div>
  </div>
</SidebarProvider>

    </div>
  );
};

export default DashboardProvider;

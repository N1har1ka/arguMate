"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { AppContext } from "@/context/AppContext";
// import your hook that returns { user, setUser }
// adjust path if your hook lives elsewhere
import { useUser } from "@/app/provider";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { mode, setMode } = useContext(AppContext);
  const { user } = useUser(); // user: undefined | null | object

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/debate", label: "Debate" },
    { path: "/about", label: "About" },
  ];

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", newMode === "dark");
    }
  };

  // Loading state: keep UI stable (small placeholder)
  const renderAuthLink = () => {
    if (user === undefined) {
      // still loading user — avoid jump by reserving same space
      return (
        <span
          className={`inline-block w-20 h-6 rounded-md animate-pulse ${
            mode === "dark" ? "bg-gray-700" : "bg-gray-200"
          }`}
        />
      );
    }

    // logged in
    if (user) {
      return (
        <Link href="/dashboard" className="font-medium text-green-600 hover:underline">
          Dashboard
        </Link>
      );
    }

    // not logged in
    return (
      <Link href="/auth" className="font-medium text-blue-600 hover:underline">
        Login
      </Link>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full shadow-md z-50 transition-colors duration-300 ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
        >
          ArguMate 
        </h1>

        {/* Navigation Links */}
        <ul className="flex space-x-6 items-center ">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={`hover:text-indigo-600 transition-colors ${
                  pathname === link.path
                    ? "text-indigo-600 font-semibold"
                    : mode === "dark"
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Right side: mode toggle + auth/dashboard */}
          <li className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleMode}
              className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-gray-700 transition cursor-pointer"
              title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
            >
              {mode === "dark" ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </button>

            {/* Auth / Dashboard link (based on useUser) */}
            {renderAuthLink()}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

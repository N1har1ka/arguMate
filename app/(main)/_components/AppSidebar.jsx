"use client";

import { useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/services/Constants";
import { usePathname, useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { Plus } from "lucide-react";

export default function AppSidebar() {
    const router = useRouter();

  const path = usePathname();
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  return (
    <Sidebar
      className={`
        transition-colors duration-500
        ${isDark ? "bg-gray-900 text-gray-100 border-r border-gray-800" : "bg-white text-gray-900 border-r border-gray-200"}
      `}
    >
      {/* Header */}
      <SidebarHeader
        className={`
          flex flex-col items-center mt-5 gap-4 transition-colors duration-300
          ${isDark ? "text-gray-100" : "text-gray-900"}
        `}
      >
        <Button
        onClick={() => router.push("/")}
          className={`
            text-3xl font-extrabold tracking-tight select-none  cursor-pointer
            ${isDark
              ? "bg-gradient-to-r from-indigo-400 to-indigo-600 text-transparent bg-clip-text"
              : "bg-gradient-to-r from-indigo-600 to-indigo-800 text-transparent bg-clip-text"}
          `}
        >
          ArguMate
        </Button>

        <Button
         onClick={() => router.push("/dashboard/create-interview")}
          className={`
            w-[85%] flex items-center gap-2 rounded-lg shadow
            transition duration-300 cursor-pointer
            ${isDark 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }
          `}
        >
          <Plus size={18} />
          Create New Debate
        </Button>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => {
                const isActive = path === option.path;

                return (
                  <SidebarMenuItem key={index} className="p-1">
                    <SidebarMenuButton asChild>
                      <a
                        href={option.path}
                        className={`
                          flex items-center gap-3 px-4 py-3 w-full text-sm rounded-md transition-all duration-200
                          ${isDark 
                            ? isActive
                              ? "bg-gray-800 text-indigo-400"
                              : "hover:bg-gray-800/60 text-gray-300"
                            : isActive
                              ? "bg-blue-50 text-blue-600"
                              : "hover:bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        <option.icon
                          className={`
                            w-5 h-5
                            ${isDark 
                              ? isActive
                                ? "text-indigo-400"
                                : "text-gray-400"
                              : isActive
                                ? "text-blue-600"
                                : "text-gray-500"}
                          `}
                        />
                        <span
                          className={`
                            text-[16px]
                            ${isDark 
                              ? isActive
                                ? "text-indigo-400 font-medium"
                                : "text-gray-300"
                              : isActive
                                ? "text-blue-600 font-medium"
                                : "text-gray-700"
                            }
                          `}
                        >
                          {option.name}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className={`
          py-4 text-center text-sm transition-colors duration-300
          ${isDark ? "text-gray-600" : "text-gray-500"}
        `}
      >
      Powered by ArguMate
      </SidebarFooter>
    </Sidebar>
  );
}

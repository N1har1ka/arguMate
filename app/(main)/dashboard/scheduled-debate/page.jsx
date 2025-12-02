"use client";

import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseclient";
import { Button } from "@/components/ui/button";
import { Clock, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// format date nicely
const formatDate = (iso) => {
  if (!iso) return "TBA";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ScheduledDebatesPage() {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadScheduled();
  }, [user]);

  const loadScheduled = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("userEmail", user?.email);

      if (error) throw error;

      const now = new Date();

      // Filter ONLY scheduled
      const scheduledOnly = (data || []).filter((row) => {
        const isCompleted = row?.completed === true;
        const scheduledAt = row?.scheduledAt ? new Date(row.scheduledAt) : null;
        const isFuture = scheduledAt && scheduledAt > now;
        return !isCompleted && isFuture;
      });

      setDebates(scheduledOnly);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load scheduled debates.");
    } finally {
      setLoading(false);
    }
  };

  const onJoin = (item) => {
    router.push(`/interview/${item.interview_id}`);
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-gray-950 text-gray-100" : "bg-indigo-50 text-gray-900"}`}>
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-extrabold mb-2">Scheduled Debates</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Debates that are upcoming
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2Icon className="animate-spin w-8 h-8" />
          </div>
        ) : debates.length === 0 ? (
          <div className={`mt-6 p-12 rounded-xl text-center ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"}`}>
            <h2 className="text-lg font-semibold">No upcoming debates</h2>
            <p className="text-sm mt-2 text-gray-400">
              You don't have any debates scheduled.
            </p>
            <Button className="mt-4" onClick={() => router.push("/dashboard/create-interview")}>
              Create New Debate
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {debates.map((item) => {
              const title = item.topic ?? item.field ?? "Untitled Debate";

              return (
                <div
                  key={item.interview_id}
                  className={`group p-6 rounded-2xl border shadow-sm transition-all
                    hover:shadow-xl hover:-translate-y-1
                    ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-gray-400">
                      <p>{formatDate(item.scheduledAt)}</p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                      Scheduled
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-semibold leading-tight
                      group-hover:text-indigo-500 transition-colors
                      ${isDark ? "text-indigo-300" : "text-indigo-700"}`}
                  >
                    {title}
                  </h3>

                  <div className="mt-6 flex items-center justify-between">
                    <Button onClick={() => onJoin(item)} className={"cursor-pointer"}>
                      Join
                    </Button>

                    <div className="flex items-center gap-1">
                      <Clock className="h-5 w-5" />
                      <p className="text-sm text-gray-400">
                        {item.duration} min
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

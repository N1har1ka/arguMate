"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseclient";
import { Button } from "@/components/ui/button";
import { Clock, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

// utility: friendly date
const formatDate = (iso) => {
  if (!iso) return "TBA";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso; // if non-standard string, show raw
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StatusBadge = ({ status }) => {
  if (status === "Scheduled")
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
        Scheduled
      </span>
    );
  if (status === "Completed")
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700">
        Completed
      </span>
    );
  // Missed
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-50 text-yellow-800">
       Missed
    </span>
  );
};

export default function MyDebatesPage() {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";
  const { user } = useUser(); // from your provider
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [debates, setDebates] = useState([]);
  const [filter, setFilter] = useState("All"); // All | Scheduled | Completed | Missed

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setDebates([]);
      return;
    }
    fetchDebates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDebates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("userEmail", user?.email)
        .order("scheduledAt", { ascending: false });

      if (error) throw error;

      const now = new Date();

      const mapped = (data || []).map((row) => {
        // According to your schema: completed is a bool column
        const isCompleted = row?.completed === true;

        // parse scheduledAt (varchar) to Date object if possible
        const scheduledAt = row?.scheduledAt ? new Date(row.scheduledAt) : null;

        // Missed if scheduledAt is in past AND not completed
        const isMissed = !isCompleted && scheduledAt && scheduledAt < now;

        const status = isCompleted ? "Completed" : isMissed ? "Missed" : "Scheduled";

        return {
          ...row,
          scheduledAt,
          status,
        };
      });

      setDebates(mapped);
    } catch (e) {
      console.error("Error loading debates:", e);
      toast.error?.("Failed to load debates");
      setDebates([]);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = (item) => {
    if (item.status === "Scheduled") {
      // open join page
      router.push(`/interview/${item.interview_id}`);
    } else if (item.status === "Completed") {
      router.push(`/interview/${item.interview_id}/completed`);
    } else {
      // Missed
      toast("⚠️ You missed this one — try again next time!", { duration: 4000 });
    }
  };

  const filtered = debates.filter((d) => {
    if (filter === "All") return true;
    return d.status === filter;
  });

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-gray-950 text-gray-100" : "bg-indigo-50 text-gray-900"}`}>
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">My Debates</h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>All debates you scheduled</p>
          </div>

          <div className="flex items-center gap-3">
            {["All", "Scheduled", "Completed", "Missed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2Icon className="animate-spin w-8 h-8" />
          </div>
        ) : debates.length === 0 ? (
          <div className={`p-12 rounded-xl ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"}`}>
            <h2 className="text-lg font-semibold">No debates yet</h2>
            <p className="text-sm mt-2 text-gray-400">Schedule your first debate to see it here.</p>
            <div className="mt-4">
              <Button onClick={() => router.push("/dashboard/create-interview")}>Create Debate</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {filtered.map((item) => {
    const title = item.topic ?? item.field ?? "Untitled Debate";
    return (
      <div
        key={item.interview_id}
        // onClick={() => onCardClick(item)}
        // role="button"
        tabIndex={0}
        className={`group p-6 rounded-2xl border shadow-sm transition-all
          hover:shadow-xl hover:-translate-y-1 
          ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
      >
        
        {/* TITLE + STATUS */}
        <div className="">
          <div className="flex justify-between items-center text-center mb-3">

            {/* DATE */}
            <div className=" text-sm text-gray-400">
              <p>{formatDate(item.scheduledAt)}</p>
            </div>

             {/* STATUS TAG */}
            <div className="">
            {item.status === "Scheduled" && (
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                Scheduled
              </span>
            )}
            {item.status === "Completed" && (
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                Completed
              </span>
            )}
            {item.status === "Missed" && (
              <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-900">
                Missed
              </span>
            )}
            </div>
          </div>
          <div className="pr-3">
            <h3
              className={`h-20 text-xl font-semibold leading-tight
                group-hover:text-indigo-500 transition-colors
                ${isDark ? "text-indigo-300" : "text-indigo-700"}`}
            >
              {title}
            </h3>

            

           


          </div>
         
        </div>

        {/* CARD FOOTER */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400 ">
            {item.status === "Scheduled" && 
            (
              <Button className="cursor-pointer" onClick={() => onCardClick(item)}>
                Join
              </Button>
            )}
            {item.status === "Completed" &&
            (
              <Button className="cursor-pointer" onClick={() => onCardClick(item)}>
                View feedback
              </Button>
            )}
            {item.status === "Missed" &&  (
              <Button className="cursor-pointer" onClick={() => onCardClick(item)}>
               Missed
              </Button>
            )}
          </div>

          {/* DURATION */}
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5"/>
              {item.duration && (
              <p className=" text-sm text-gray-400">
                 <span className="font-medium text-gray-300">{item.duration} minutes</span>
              </p>
            )}
            </div>

          {/* <Button
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(item);
            }}
            className={`rounded-lg font-medium ${
              item.status === "Missed"
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            variant={item.status === "Missed" ? "outline" : undefined}
          >
            {item.status === "Scheduled"
              ? "Open"
              : item.status === "Completed"
              ? "View"
              : "Expired"}
          </Button> */}
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


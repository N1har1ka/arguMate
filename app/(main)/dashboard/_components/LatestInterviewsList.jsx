"use client";

import React, { useRef, useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseclient";

/**
 * LatestInterviewsList
 * - Renders a horizontal, snap-scrolling list of the user's recent debates.
 * - Uses your existing Interviews table (filters by userEmail).
 * - Each card shows: topic (jobPosition/ topic/ field) + scheduledAt (friendly).
 * - Respects app mode (dark/light).
 *
 * Place this component where you want the "Previously created debates" carousel.
 */

const LatestInterviewsList = ({ initialLimit = 12 }) => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  const { user } = useUser();
  const router = useRouter();

  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // friendly date (short)
  const formatDate = (iso) => {
    if (!iso) return "TBA";
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  // update arrow visibility
  const updateArrows = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 2);
  };

  useEffect(() => {
    updateArrows();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  // fetch from supabase
  useEffect(() => {
    if (!user) {
      setInterviewList([]);
      setLoading(false);
      return;
    }

    let active = true;
    const fetchList = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Interviews")
          .select("*")
          .eq("userEmail", user.email)
          .order("created_at", { ascending: false })
          .limit(initialLimit);

        if (error) throw error;

        if (!active) return;

        const normalized = (data || []).map((r) => ({
          id: r.interview_id ?? r.id ?? r.interview_id,
          created_at:r.created_at,
          topic: r.topic ?? r.jobPosition ?? r.field ?? "Untitled Debate",
          scheduledAt: r.scheduledAt ?? r.created_at ?? null,
        }));

        setInterviewList(normalized);
      } catch (err) {
        console.error("LatestInterviewsList fetch error:", err);
        setInterviewList([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchList();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, initialLimit]);

  const scrollByCard = (dir = "right") => {
    const el = containerRef.current;
    if (!el) return;
    const first = el.querySelector("[data-card]");
    if (!first) return;
    const style = getComputedStyle(first);
    const marginRight = parseFloat(style.marginRight) || 0;
    const cardWidth = first.offsetWidth + marginRight;
    el.scrollBy({ left: dir === "right" ? cardWidth : -cardWidth, behavior: "smooth" });
  };

  const openInterview = (id) => {
    if (!id) return;
    router.push(`/interview/${id}`);
  };

  return (
    <div className="my-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-bold text-2xl ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          Previously created debates
        </h2>

        {/* <div className="flex items-center gap-2">
          <button
            onClick={() => scrollByCard("left")}
            disabled={!canScrollLeft}
            aria-label="scroll-left"
            className={`p-2 rounded-md transition ${
              canScrollLeft ? (isDark ? "hover:bg-white/6" : "hover:bg-black/4") : "opacity-40 cursor-not-allowed"
            } ${isDark ? "text-gray-200" : "text-gray-700"}`}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => scrollByCard("right")}
            disabled={!canScrollRight}
            aria-label="scroll-right"
            className={`p-2 rounded-md transition ${
              canScrollRight ? (isDark ? "hover:bg-white/6" : "hover:bg-black/4") : "opacity-40 cursor-not-allowed"
            } ${isDark ? "text-gray-200" : "text-gray-700"}`}
          >
            <ChevronRight size={18} />
          </button>
        </div> */}
      </div>

      {loading ? (
        <div className={`p-6 rounded-lg ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"}`}>
          <div className="text-sm text-gray-400">Loading recent debates…</div>
        </div>
      ) : interviewList.length === 0 ? (
        <div className={`p-6 flex flex-col gap-3 items-center rounded-lg ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"}`}>
          <Video className="h-10 w-10 text-primary" />
          <h3 className={isDark ? "text-gray-100" : "text-gray-800"}>You don't have any debates created!</h3>
        </div>
      ) : (
        <div className="relative">
          <div
            ref={containerRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
          >
            {interviewList.map((it) => (
              <article
                key={it.id}
                data-card
                //onClick={() => openInterview(it.id)}
                role="button"
                tabIndex={0}
                className={`snap-start flex-shrink-0 w-[85%] sm:w-[46%] lg:w-[30%] p-4 rounded-xl border transition-shadow 
                  ${isDark ? "bg-gray-900 border-gray-700 hover:shadow-lg" : "bg-white border-gray-200 hover:shadow-xl"}`}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {formatDate(it.created_at)}
                    </div>
                    <h3 className={`font-semibold text-lg mb-1 line-clamp-2 ${isDark ? "text-gray-100" : "text-indigo-700"}`}>
                      {it.topic}
                    </h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestInterviewsList;

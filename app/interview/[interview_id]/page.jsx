"use client";

import React, { useContext, useEffect, useState } from "react";
import { Clock, InfoIcon, Loader2Icon, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseclient";
import { toast } from "sonner";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { AppContext } from "@/context/AppContext";
import { useUser } from "@/app/provider"; // adjust path if your project uses a different hook location

const Interview = () => {
  const router = useRouter();
  const { interview_id } = useParams();
  const { user } = useUser();
  const [userEmail, setUserEmail] = useState("");
  const [interviewData, setInterviewData] = useState();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  useEffect(() => {
    // load interview meta
    interview_id && GetInterviewDetails();
    // attempt to autofill user email/name when user is available
    if (user?.email) {
      setUserEmail(user.email);
      fetchNameByEmail(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview_id, user?.email]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      const { data: Interviews, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("interview_id", interview_id);

      setLoading(false);

      if (error) {
        console.error("Supabase error:", error);
        toast.error("Failed to fetch interview details");
        return;
      }

      if (!Interviews || Interviews.length === 0) {
        toast.error("Incorrect or expired interview link");
        return;
      }

      setInterviewData(Interviews[0]);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Incorrect interview link");
    }
  };

  // Try to get user's full name from DB using their email.
  // We attempt a couple of common table names (profiles, Users) — adjust if your schema differs.
  const fetchNameByEmail = async (email) => {
    if (!email) return;
    try {
      // Try 'profiles' first (common pattern), then 'Users' (you may rename to your actual table)
      const tries = [
        { table: "profiles", col: "full_name" }, // example column name
        { table: "profiles", col: "name" },
        { table: "Users", col: "name" },
        { table: "Users", col: "full_name" },
        { table: "Users", col: "user_name" },
      ];

      for (const t of tries) {
        // guarded try so a missing column/table won't stop other attempts
        try {
          const resp = await supabase
            .from(t.table)
            .select(t.col)
            .eq("email", email)
            .limit(1)
            .maybeSingle();

          // resp can be { data: null } or { data: { name: '...' } }
          if (resp?.data) {
            const foundName =
              resp.data[t.col] ||
              resp.data.name ||
              resp.data.full_name ||
              resp.data.user_name;
            if (foundName) {
              setUserName(String(foundName));
              return;
            }
          }
        } catch (e) {
          // ignore and continue trying other table/column combos
          // console.debug("fetchNameByEmail attempt failed for", t.table, t.col, e);
        }
      }

      // if not found, fall back to deriving a display name from the email local-part
      const fallback = email.split("@")[0].replace(/[._-]/g, " ");
      setUserName(
        fallback
          .split(" ")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ")
      );
    } catch (err) {
      console.error("Error fetching name for email:", err);
    }
  };

  const simpleEmailValid = (email) =>
    typeof email === "string" && /\S+@\S+\.\S+/.test(email);

  const onJoinInterview = async () => {
    // ensure we have values from the autoload
    if (!userEmail || !simpleEmailValid(userEmail)) {
      toast.error("No valid signed-in email found. Please sign in.");
      return;
    }
    if (!userName?.trim()) {
      toast.error("No user name found for this account.");
      return;
    }

    setLoading(true);

    try {
      const { data: Interviews, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("interview_id", interview_id);

      if (error) {
        console.error("Supabase select error:", error);
        toast.error("Failed to fetch interview");
        setLoading(false);
        return;
      }

      if (!Interviews || Interviews.length === 0) {
        toast.error("Interview not found");
        setLoading(false);
        return;
      }

      setInterviewInfo({
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        interviewData: Interviews[0],
      });

      // navigate to the interview start route (this component is already in .../start, but preserving your flow)
      router.push(`/interview/${interview_id}/start`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to join interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen px-6 md:px-20 lg:px-36 xl:px-48 py-8 transition-colors duration-300 ${
        isDark ? "bg-gray-950 text-gray-100" : "bg-indigo-50 text-gray-900"
      }`}
    >
      <div
        className={`max-w-3xl mx-auto mt-8 rounded-2xl transition-colors duration-300 shadow-lg ${
          isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <div className="p-8 md:p-12 flex flex-col items-center gap-4">
          <h2 className={`text-2xl font-extrabold ${isDark ? "text-indigo-300" : "text-indigo-700"}`}>
            AI-powered Debate Session
          </h2>

          <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-center max-w-xl`}>
            Join the scheduled debate. We detected your signed-in account and loaded your details automatically.
          </p>

          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-gray-100 border border-gray-200"
              }`}
            >
              <Clock className={`${isDark ? "text-gray-300" : "text-gray-600"} w-4 h-4`} />
              <div>
                <div className="text-sm font-medium">Duration</div>
                <div className="text-xs text-gray-400">{interviewData?.duration ?? "—"} minutes</div>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-gray-100 border border-gray-200"
              }`}
            >
              <InfoIcon className={`${isDark ? "text-gray-300" : "text-gray-600"} w-4 h-4`} />
              <div>
                <div className="text-sm font-medium">Type</div>
                <div className="text-xs text-gray-400">{interviewData?.type ?? "Standard"}</div>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 grid grid-cols-1 gap-4">
            <label className="text-sm font-medium">Full name</label>
            <Input
              placeholder="Your name"
              value={userName}
              readOnly
              className={`rounded-md ${isDark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200"}`}
            />

            <label className="text-sm font-medium">Email address</label>
            <Input
              placeholder="Your email"
              value={userEmail}
              readOnly
              className={`rounded-md ${isDark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200"}`}
            />
          </div>

          <div
            className={`w-full mt-6 p-4 rounded-lg flex gap-4 items-start ${
              isDark ? "bg-gray-800 border border-gray-700" : "bg-blue-50 border border-blue-100"
            }`}
          >
            <div className={`${isDark ? "text-blue-300" : "text-blue-700"}`}>
              <InfoIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Before you begin</h3>
              <ul className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-2 list-disc pl-5 space-y-1 text-sm`}>
                <li>Test your camera and microphone</li>
                <li>Ensure a stable internet connection</li>
                <li>Find a quiet place free from interruptions</li>
              </ul>
            </div>
          </div>

          <div className="w-full mt-6">
            <Button
              onClick={onJoinInterview}
              disabled={loading || !userEmail || !userName}
              className="w-full flex items-center justify-center gap-2 py-4 font-semibold"
            >
              {loading && <Loader2Icon className="animate-spin" />}
              <Video size={16} />
              <span className="cursor-pointer">Join debate</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;

// import React from 'react';
// import { Home, ArrowRight } from 'lucide-react';

// const InterviewComplete = () => {
//   return (
//     <div className="bg-midnight text-white font-sans antialiased flex flex-col min-h-screen">

//       {/* Main Content */}
//       <main className="flex-grow flex flex-col items-center justify-center space-y-8 py-16">

//         {/* Success Icon */}
//         <div className="rounded-full bg-seaGreen p-4">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-12 w-12 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         </div>

//         {/* Heading */}
//         <h1 className="text-4xl font-bold text-center">Interview Complete!</h1>

//         {/* Subheading */}
//         <p className="text-lg text-gray-300 text-center">
//           Thank you for participating in the AI-driven interview with Alcruiter.
//         </p>

//         {/* Image */}
//         <div className="rounded-xl overflow-hidden shadow-lg">
//           <img
//             src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
//             alt="Interview Illustration"
//             className="w-full h-auto object-cover max-w-4xl"
//             style={{
//               backgroundImage: 'url(https://i.imgur.com/g5B0C9N.png)',
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               width: '800px',
//               height: '400px',
//             }}
//           />
//         </div>

//         {/* Next Steps */}
//         <div className="bg-midnightLighter rounded-xl p-8 shadow-md w-full max-w-xl space-y-4">
//           <div className="flex items-center justify-center rounded-full bg-midnightLightest w-12 h-12 mx-auto">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 text-electricBlue"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 19l9-7-9-7-9 7 9 7z"
//               />
//             </svg>
//           </div>

//           <h2 className="text-2xl font-semibold text-center">What's Next?</h2>

//           <p className="text-gray-300 text-center">
//             The recruiter will review your interview responses and will contact you soon regarding the next steps.
//           </p>

//           <p className="text-gray-400 text-sm text-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4 inline-block mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 8v4l3 3"
//               />
//             </svg>
//             Response within 2–3 business days
//           </p>
//         </div>

//         {/* Buttons */}
//         <div className="flex space-x-4">
//           <button className="bg-midnightLightest text-gray-300 hover:text-white rounded-lg py-3 px-6 flex items-center space-x-2 transition duration-300 ease-in-out">
//             <Home className="h-5 w-5" />
//             <span>Return to Homepage</span>
//           </button>

//           <button className="bg-electricBlue hover:bg-electricBlueDark text-white rounded-lg py-3 px-6 flex items-center space-x-2 transition duration-300 ease-in-out">
//             <span>View Other Opportunities</span>
//             <ArrowRight className="h-5 w-5" />
//           </button>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-midnightLighter text-gray-400 text-center py-4">
//         <p>&copy; 2023 Alcruiter. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default InterviewComplete;


"use client";

import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { supabase } from "@/services/supabaseclient";
import { Loader2Icon, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * CompletedFeedbackPage
 * - Fetches saved feedback from `debate-feedback` by interview_id
 * - Displays ratings, summary, strengths, improvementPoints, and raw JSON
 */
export default function CompletedFeedbackPage() {
  const { interview_id } = useParams();
  const router = useRouter();
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState(null);
  const [rawJSON, setRawJSON] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!interview_id) return;
    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview_id]);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);

    try {
      // fetch the most recent feedback row for this interview_id
      const { data, error } = await supabase
        .from("debate-feedback")
        .select("feedback, created_at")
        .eq("interview_id", interview_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // not found or other error
        throw error;
      }

      if (!data || !data.feedback) {
        throw new Error("No feedback found for this interview.");
      }

      // feedback may be object or JSON string — normalize
      let parsed = data.feedback;
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch (e) {
          // keep as string inside an object
          parsed = { raw: parsed };
        }
      }

      setFeedbackData(parsed);
      setRawJSON(parsed);
    } catch (err) {
      console.log("Fetch feedback error:", err);
      setError(err.message || "Failed to load feedback.");
      toast.error?.(err.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(rawJSON ?? feedbackData ?? {}, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-${interview_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-950 text-gray-100" : "bg-indigo-50 text-gray-900"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="animate-spin w-10 h-10" />
          <p className="text-sm">{`Loading feedback for ${interview_id}...`}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${
          isDark ? "bg-gray-950 text-gray-100" : "bg-indigo-50 text-gray-900"
        }`}
      >
        <div
          className={`max-w-xl w-full rounded-xl p-6 ${
            isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-2">Feedback not available</h2>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={fetchFeedback}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  // expected keys: rating, summary, strengths, improvementPoints
  const rating = feedbackData?.rating ?? feedbackData?.feedback?.rating ?? null;
  const summary = feedbackData?.summary ?? feedbackData?.feedback?.summary ?? null;
  const strengths = feedbackData?.strengths ?? feedbackData?.feedback?.strengths ?? [];
  const improvementPoints =
    feedbackData?.improvementPoints ?? feedbackData?.feedback?.improvementPoints ?? [];

  return (
    <div
      className={`min-h-screen p-6 lg:px-48 xl:px-56 transition-colors duration-300 ${
        isDark ? "bg-gray-950 text-gray-100" : "bg-indigo-50 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Debate Feedback</h1>
            <p className="text-sm text-gray-400">Results for debate id: {interview_id}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button onClick={downloadJSON}>
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
          </div>
        </div>

        {/* Summary card */}
        <div
          className={`p-6 rounded-xl transition-colors duration-200 ${
            isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
            {summary ?? "No summary provided."}
          </p>
        </div>

        {/* Ratings */}
        <div
          className={`p-6 rounded-xl transition-colors duration-200 ${
            isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">Ratings</h2>
          {rating ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(rating).map(([k, v]) => (
                <div
                  key={k}
                  className={`p-3 rounded-md ${
                    isDark ? "bg-gray-800/50" : "bg-gray-50"
                  } flex flex-col`}
                >
                  <span className="text-xs text-gray-400 capitalize">{k}</span>
                  <span className="text-xl font-semibold">{Number(v) ?? "-"}/10</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No ratings provided.</p>
          )}
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-6 rounded-xl transition-colors duration-200 ${
              isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
            }`}
          >
            <h3 className="font-semibold mb-3">Strengths</h3>
            {Array.isArray(strengths) && strengths.length ? (
              <ul className="list-disc list-inside space-y-2 text-sm">
                {strengths.map((s, i) => (
                  <li key={i} className="text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No strengths listed.</p>
            )}
          </div>

          <div
            className={`p-6 rounded-xl transition-colors duration-200 ${
              isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
            }`}
          >
            <h3 className="font-semibold mb-3">Improvement Points</h3>
            {Array.isArray(improvementPoints) && improvementPoints.length ? (
              <ul className="list-disc list-inside space-y-2 text-sm">
                {improvementPoints.map((s, i) => (
                  <li key={i} className="text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No improvement points listed.</p>
            )}
          </div>
        </div>

        {/* Raw JSON
        <div
          className={`p-4 rounded-xl transition-colors duration-200 ${
            isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
          }`}
        >
          <h3 className="font-semibold mb-3">Raw feedback (JSON)</h3>
          <pre className="max-h-56 overflow-auto text-xs whitespace-pre-wrap">
            {JSON.stringify(rawJSON ?? feedbackData ?? {}, null, 2)}
          </pre>
        </div> */}
      </div>
    </div>
  );
}

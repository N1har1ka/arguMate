
import{ useContext, useEffect, useState } from "react";
import { supabase } from "@/services/supabaseclient";
import { BarChart3, CheckCircle } from "lucide-react";
import { useUser } from "@/app/provider";
import { AppContext } from "@/context/AppContext";

/* MiniBar: numeric-safe */
const MiniBar = ({ values = [], label }) => {
  const cleanValues = values.map((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  });
  const max = Math.max(...cleanValues, 10);
  return (
    <div className="w-full">
      <p className="text-xs mb-1 opacity-70">{label}</p>
      <div className="flex items-end gap-1 h-12 pb-1">
        {cleanValues.map((v, i) => (
          <div
            key={i}
            className="w-3 rounded-md bg-indigo-500"
            style={{ height: `${(v / max) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default  function DashboardStats() {
  const { user } = useUser();
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState({ debates: null, feedbackList: null, parsedRows: [] });

  const safeParse = (val) => {
    if (val == null) return null;
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  };

  const fetchStats = async () => {
    console.log("DBG fetchStats start", { userEmail: user?.email });
    setLoading(true);
    setDebug({ debates: null, feedbackList: null, parsedRows: [] });

    try {
      if (!user?.email) {
        console.warn("DBG: user email missing — skipping");
        setStats(null);
        setLoading(false);
        return;
      }

      const { data: debates, error: debatesErr } = await supabase
        .from("Interviews")
        .select("*")
        .eq("userEmail", user.email)
        .eq("completed", true);

      console.log("DBG debates result:", { debates, debatesErr });

      if (debatesErr) throw debatesErr;
      if (!debates || debates.length === 0) {
        setStats(null);
        setDebug((d) => ({ ...d, debates }));
        setLoading(false);
        return;
      }

      const ids = debates.map((d) => d.interview_id).filter(Boolean);
      if (ids.length === 0) {
        setStats(null);
        setDebug((d) => ({ ...d, debates }));
        setLoading(false);
        return;
      }

      const { data: feedbackList, error: fbErr } = await supabase
        .from("debate-feedback")
        .select("*")
        .in("interview_id", ids);

      console.log("DBG feedbackList result:", { feedbackList, fbErr });
      setDebug((d) => ({ ...d, debates, feedbackList }));

      if (fbErr) throw fbErr;
      if (!feedbackList || feedbackList.length === 0) {
        setStats(null);
        setLoading(false);
        return;
      }

      // Compute totals with deep inspection and multiple fallbacks
      const totals = { clarity: 0, reasoning: 0, confidence: 0, engagement: 0 };
      let validRows = 0;
      const parsedRows = [];

      feedbackList.forEach((fb, idx) => {
        // 1) try fb.feedback directly
        let parsed = safeParse(fb.feedback);

        // 2) some people store JSON under a 'payload' or 'data' wrapper — check common fallbacks
        if (!parsed) {
          parsed = safeParse(fb?.data) || safeParse(fb?.payload) || safeParse(fb?.feedback_json) || null;
        }

        // 3) if still not parsed, maybe it's an object in another key
        if (!parsed && typeof fb === "object") {
          // try to find an object value that contains 'rating'
          for (const k of Object.keys(fb)) {
            if (fb[k] && typeof fb[k] === "object" && fb[k].rating) {
              parsed = fb[k];
              break;
            }
          }
        }

        // 4) potential rating paths to check
        const ratingCandidates = [
          parsed?.rating,
          parsed?.feedback?.rating,
          parsed?.data?.rating,
          parsed?.payload?.rating,
          fb?.rating, // if stored flat
        ];

        let rating = ratingCandidates.find(Boolean) || {};

        // convert strings -> numbers
        const c = Number(rating?.clarity ?? rating?.clarity_score ?? rating?.c) || 0;
        const r = Number(rating?.reasoning ?? rating?.reasoning_score ?? rating?.r) || 0;
        const conf = Number(rating?.confidence ?? rating?.confidence_score ?? rating?.conf) || 0;
        const egt = Number(rating?.engagement ?? rating?.engagement_score ?? rating?.e) || 0;

        // log per-row parsed result for debugging
        console.log("DBG_FEEDBACK_ROW", idx, { raw: fb, parsed, rating, numeric: { c, r, conf, egt } });

        parsedRows.push({ raw: fb, parsed, rating, numeric: { c, r, conf, egt } });

        // if any non-zero numeric exists, count it as valid
        if (c || r || conf || egt) validRows++;

        totals.clarity += c;
        totals.reasoning += r;
        totals.confidence += conf;
        totals.engagement += egt;
      });

      // decide divisor
      const divisor = validRows || feedbackList.length || 1;

      const result = {
        clarity: Number((totals.clarity / divisor).toFixed(1)),
        reasoning: Number((totals.reasoning / divisor).toFixed(1)),
        confidence: Number((totals.confidence / divisor).toFixed(1)),
        engagement: Number((totals.engagement / divisor).toFixed(1)),
        count: feedbackList.length,
      };

      console.log("DBG computed stats:", result);

      setDebug((d) => ({ ...d, parsedRows }));
      setStats(result);
    } catch (err) {
      console.error("DBG fetchStats error:", err);
      setStats(null);
    } finally {
      setLoading(false);
      console.log("DBG fetchStats finished");
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  if (loading) return <p className="opacity-60 mt-6">Loading your dashboard stats…</p>;

  if (!stats)
    return (
      <div className="mt-6">
        {/* <CreateOptions /> */}
        <h2 className="text-2xl font-bold mb-4">Your Debate Performance</h2>
        <div className="mt-4 p-3 bg-red-900/10 rounded">
          <h4 className="font-semibold">No debate attended</h4>
          {/* <p className="text-xs opacity-80 mb-2">Paste one feedback row here if you want me to inspect it.</p>
          <pre className="text-xs overflow-auto max-h-60">
            {JSON.stringify(debug, null, 2)}
          </pre> */}
        </div>
      </div>
    );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Debate Performance</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          ["Clarity", stats.clarity],
          ["Reasoning", stats.reasoning],
          ["Confidence", stats.confidence],
          ["Engagement", stats.engagement],
        ].map(([label, value]) => (
          <div
            key={label}
            className={`rounded-xl p-4 border shadow-sm ${
              isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <p className="text-sm opacity-70">{label}</p>
            <p className="text-3xl font-semibold mt-1">{Number(value).toFixed(1)}/10</p>
          </div>
        ))}
      </div>

      <div
        className={`rounded-xl p-5 border flex items-center gap-4 mb-6 ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <CheckCircle className="text-green-500 h-10 w-10" />
        <div>
          <p className="text-lg font-bold">{stats.count} Debates Completed</p>
          <p className="opacity-70 text-sm">Great consistency!</p>
        </div>
      </div>

      {/* <div
        className={`rounded-xl p-5 border ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" /> Improvement Overview
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MiniBar label="Clarity" values={[stats.clarity, 10]} />
          <MiniBar label="Reasoning" values={[stats.reasoning, 10]} />
          <MiniBar label="Confidence" values={[stats.confidence, 10]} />
          <MiniBar label="Engagement" values={[stats.engagement, 10]} />
        </div>
      </div> */}
      {/* Improved Improvement Overview */}
{/* <ImprovementOverview stats={stats} /> */}

    </div>
  );
}
// ImprovementOverview component — paste above your return in DashboardStats file
const ImprovementOverview = ({ stats }) => {
  // ensure numbers
  const data = [
    { key: "clarity", label: "Clarity", value: Number(stats?.clarity ?? 0) },
    { key: "reasoning", label: "Reasoning", value: Number(stats?.reasoning ?? 0) },
    { key: "confidence", label: "Confidence", value: Number(stats?.confidence ?? 0) },
    { key: "engagement", label: "Engagement", value: Number(stats?.engagement ?? 0) },
  ];

  // max scale (0-10)
  const MAX = 10;
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";
  return (
    <div
      className={`rounded-xl p-5 border ${
        // reuse your isDark variable in parent scope when calling
        isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" /> Improvement Overview
      </h3>

      <div className="flex gap-6 items-end justify-between">
        {data.map(({ key, label, value }) => {
          // clamp and normalized height percent
          const clamped = Math.max(0, Math.min(MAX, Number(value) || 0));
          const heightPercent = (clamped / MAX) * 100;

          // color based on score
          const colorClass =
            clamped >= 8 ? "from-green-400 to-green-600" :
            clamped >= 6 ? "from-yellow-400 to-yellow-600" :
            "from-indigo-400 to-indigo-600";

          return (
            <div key={key} className="flex flex-col items-center w-1/4">
              {/* numeric value */}
              <div className="text-sm font-medium mb-2">
                <span className="text-lg font-bold">{clamped.toFixed(1)}</span>
                <span className="text-xs opacity-70 ml-1">/10</span>
              </div>

              {/* bar container (fixed height for clarity) */}
              <div
                className="w-10 h-36 flex items-end justify-center rounded-md overflow-hidden bg-gray-800/30 dark:bg-gray-800"
                role="img"
                aria-label={`${label} ${clamped.toFixed(1)} out of 10`}
                title={`${label}: ${clamped.toFixed(1)}/10`}
              >
                <div
                  style={{
                    height: `${heightPercent}%`,
                    transition: "height 600ms cubic-bezier(.2,.9,.2,1)",
                  }}
                  className={`w-full rounded-md bg-gradient-to-t ${colorClass}`}
                />
              </div>

              {/* label and mini scale */}
              <div className="mt-2 text-xs opacity-80 text-center">
                <div>{label}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] opacity-60">0</span>
                  <div className="h-1 flex-1 bg-gray-700/30 rounded-full mx-2" />
                  <span className="text-[10px] opacity-60">10</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

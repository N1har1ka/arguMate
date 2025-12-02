"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState, useContext } from "react";
import QuestionListContainer from "./QuestionListContainer";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/services/supabaseclient";
import { useUser } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";
import { AppContext } from "@/context/AppContext";

const QuestionList = ({ formData, onCreateLink }) => {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);

  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  useEffect(() => {
    if (formData) {
      // your gql placeholder
      // gql();
    }
  }, [formData]);

  const gql = () => {
    setLoading(true);
  };

  const onFinish = async () => {
    setSaveLoading(true);
    const interview_id = uuidv4();

    try {
      const { data, error } = await supabase
        .from("Interviews")
        .insert([
          {
            ...formData,
            points: questionList,
            userEmail: user?.email,
            interview_id: interview_id,
          },
        ])
        .select();

      if (error) throw error;

      console.log("new interview created", data);
      onCreateLink(interview_id);
    } catch (err) {
      console.error("create interview error:", err);
      toast.error?.("Failed to save interview. Try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const HARDCODED_QUESTIONS = [
    {
      question: "Explain your experience with building scalable systems.",
      type: "Technical",
    },
    {
      question: "Describe a challenging bug you solved recently.",
      type: "Experience",
    },
    {
      question: "How do you prioritize tasks under tight deadlines?",
      type: "Behavioral",
    },
    {
      question: "How would you design a real-time chat application?",
      type: "Problem Solving",
    },
    {
      question: "Describe a time you demonstrated leadership on a project.",
      type: "Leadership",
    },
  ];
  const HARDCODED_DEBATE_POINTS = [
  {
    question: "What is your main argument in favor of your position?",
    type: "Opening"
  },
  {
    question: "What evidence or examples support your viewpoint?",
    type: "Supporting Argument"
  },
  {
    question: "What are the strongest arguments the opposing side might make?",
    type: "Anticipation"
  },
  {
    question: "How would you counter or weaken the opponent’s claims?",
    type: "Rebuttal"
  },
  {
    question: "What real-world example best illustrates your argument?",
    type: "Evidence"
  },
  {
    question: "What could be the negative consequences if your position is ignored?",
    type: "Impact"
  },
  {
    question: "How would you summarize your stance in one concise closing statement?",
    type: "Closing"
  }
];


  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });

      const raw = result?.data?.content ?? result?.data ?? result;
      let str = typeof raw === "string" ? raw : JSON.stringify(raw);

      str = str.replace(/```json\s*/i, "").replace(/```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(str);
      } catch (err) {
        const matchArray = str.match(/\[.*\]/s);
        const matchObject = str.match(/\{[\s\S]*\}/s);
        const candidate = matchArray ? matchArray[0] : matchObject ? matchObject[0] : null;
        if (candidate) parsed = JSON.parse(candidate);
        else throw err;
      }

      let items = [];

      if (Array.isArray(parsed)) {
        items = parsed;
      } else if (parsed?.interviewQuestions && Array.isArray(parsed.interviewQuestions)) {
        items = parsed.interviewQuestions;
      } else if (parsed?.debatePoints) {
        const { forSide = [], againstSide = [], rebuttals = [] } = parsed.debatePoints;
        items = [
          ...forSide.map((p) => ({ point: p.point || p, type: "For" })),
          ...againstSide.map((p) => ({ point: p.point || p, type: "Against" })),
          ...rebuttals.map((r) => ({
            point: r.response || r.attacks || r.point || JSON.stringify(r),
            type: "Rebuttal",
          })),
        ];
      } else if (typeof parsed === "object") {
        const arrays = Object.values(parsed).filter((v) => Array.isArray(v));
        if (arrays.length) items = arrays.flat();
        else items = [{ point: JSON.stringify(parsed), type: "Info" }];
      } else {
        throw new Error("Unable to parse model output.");
      }

      const normalized = items
        .map((it) => {
          const question = it.question ?? it.point ?? it.text ?? it.prompt ?? "";
          const type = it.type ?? (it.attacks ? "Rebuttal" : "");
          return { question: String(question).trim(), type: String(type).trim() };
        })
        .filter((i) => i.question);

      if (normalized.length === 0) throw new Error("Model returned no usable points.");

      setQuestionList(normalized);
    } catch (e) {
      console.error("GenerateQuestionList error:", e);
      toast.error?.("Server Error or invalid response - try again!");
      // optional fallback
      // setQuestionList(HARDCODED_QUESTIONS.map(h => ({ question: h.question, type: h.type })));
    } finally {
      setLoading(false);
    }
  };

  // Theme-aware classes
  const cardBg = isDark ? "bg-gray-900 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900";
  const infoBg = isDark ? "bg-gray-800/60 border-gray-700" : "bg-blue-50";
  const subtleText = isDark ? "text-gray-300" : "text-gray-600";
  const accentText = isDark ? "text-indigo-300" : "text-indigo-700";
  const btnClass = isDark ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white";

  return (
    <div className={`space-y-6`}>
      {loading && (
        <div className={`flex flex-col gap-3`}>
          <div className="flex items-center gap-3">
            <Loader2 className={`animate-spin ${isDark ? "text-indigo-300" : "text-indigo-600"}`} />
            <h3 className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              Generating debate-related points
            </h3>
          </div>

          <div className={`p-5 rounded-xl border ${infoBg} ${isDark ? "text-gray-200" : ""}`}>
            <p className={`${accentText} font-medium mb-1`}>AI is crafting a personalized point list</p>
            <p className={`${subtleText} text-sm`}>
              This may take a few seconds — the model is tailoring questions to your chosen topic.
            </p>
          </div>
        </div>
      )}

      {!loading && questionList?.length > 0 && (
        <div>
          <QuestionListContainer questionList={questionList} />
        </div>
      )}

      {/* When there are no questions yet, show a compact CTA (theme aware) */}
      {!loading && (!questionList || questionList.length === 0) && (
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <h3 className="font-semibold mb-2">No questions generated yet</h3>
          <p className={`text-sm ${subtleText} mb-4`}>
            Click the button to generate interview questions using AI, or add some manually.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={GenerateQuestionList} className={`${btnClass} cursor-pointer`}>
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Generate Questions"}
            </Button>

            {/* <Button
            className={"cursor-pointer"}
              onClick={() => setQuestionList(HARDCODED_DEBATE_POINTS.map((h) => ({ question: h.question, type: h.type })))}
              variant="outline"
            >
              Use Example Questions
            </Button> */}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button  onClick={() => onFinish()} disabled={saveLoading} className={`${btnClass} cursor-pointer`}>
          {saveLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          Create Interview Link & finish
        </Button>
      </div>
    </div>
  );
};

export default QuestionList;

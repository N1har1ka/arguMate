// "use client"
// import React, { useContext, useEffect, useRef, useState } from 'react'
// import Interview from '../page'
// import { InterviewDataContext } from '@/context/InterviewDataContext'
// import { Loader2Icon, Mic, Phone, Timer } from 'lucide-react'
// import Image from 'next/image'
// import Vapi from '@vapi-ai/web'
// import AlertConfirmation from './_components/AlertConfirmation'
// import { toast } from 'sonner'
// import axios from 'axios'
// import { supabase } from '@/services/supabaseclient'
// import { useParams } from 'next/navigation'
// import { useRouter } from 'next/navigation'

// const StartInterview = () => {
//   const [conversation, setConversation] = useState(null)
//   const conversationRef = useRef(null) // keep latest conversation here for sync use
//   const [activeUser, setActiveUser] = useState(false)
//   const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext)
//   const {interview_id}=useParams();
//   const[loading,setLoading]=useState(false);
//   const router=useRouter();
//   // create vapi once and persist it
//   const vapiRef = useRef(null)
//   if (!vapiRef.current) {
//     vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY)
//   }
//   const vapi = vapiRef.current

//   useEffect(() => {
//     if (interviewInfo) startCall()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [interviewInfo])

//   const buildQuestionsString = (interviewInfo) => {
//     const qArr = interviewInfo?.interviewData?.questionList ?? interviewInfo?.questionList ?? []
//     if (!Array.isArray(qArr)) return ""
//     return qArr.map((q) => q?.question ?? q).join("\n")
//   }

//   const startCall = async () => {
//     if (!interviewInfo) return
//     const questionsText = buildQuestionsString(interviewInfo)
//     const assistantOptions = {
//       name: "AI Recruiter",
//       firstMessage: `Hi ${interviewInfo?.userName || "Candidate"}, ready for your interview?`,
//       model: {
//         provider: "openai",
//         model: "gpt-4o",
//         messages: [
//           {
//             role: "system",
//             content: `You are an AI interviewer. Ask these questions one at a time:\n\n${questionsText}`,
//           },
//         ],
//       },
//     }

//     try {
//       const res = await vapi.start(assistantOptions)
//       const callId = res?.callId ?? res?.call_id ?? res?.id ?? res?.data?.call_id ?? null
//       if (callId) console.log("FOUND callId:", callId)
//       else console.warn("No callId in vapi.start return")
//     } catch (err) {
//       console.error("vapi.start error (caught):", err)
//       toast.error("Failed to start interview — check console for details")
//     }
//   }

//   const stopInterview = () => {
//     console.log("stopInterview called, vapi instance:", vapi)
//     vapi?.stop?.()
//   }

//   // Attach listeners once and clean them up
//   useEffect(() => {
//     if (!vapi) return

//     const onCallStart = () => {
//       console.log("Call started")
//       toast("call connected")
//     }

//     const onSpeechStart = () => {
//       console.log("assistant Speech started")
//       setActiveUser(false)
//     }

//     const onSpeechEnd = () => {
//       console.log("Speech ended")
//       setActiveUser(true)
//     }

//     const onCallEnd = () => {
//       console.log("main Call ended")
//       toast("main call ended")

//       // Use conversationRef for synchronous access to latest conversation
//       const latestConversation = conversationRef.current
//       console.log("latestConversation (ref):", latestConversation)

//       if (latestConversation && latestConversation.length) {
//         //GenerateFeedback(latestConversation)
//       } else {
//         console.warn("No conversation available to send for feedback")
//       }
//     }

//     const onMessage = (msg) => {
//       // ONLY handle conversation updates
//       if (msg?.type === "conversation-update" && Array.isArray(msg.conversation)) {
//         // update react state (async)
//         setConversation(msg.conversation)

//         // update ref immediately for synchronous usage
//         conversationRef.current = msg.conversation

//         // helpful immediate debug log (this is the freshest data)
//         console.log("fresh conversation (msg):", msg.conversation)
//       } else {
//         // For debugging other message types:
//         // console.log("other message type:", msg?.type, msg)
//       }
//     }

//     // attach
//     vapi.on("call-start", onCallStart)
//     vapi.on("speech-start", onSpeechStart)
//     vapi.on("speech-end", onSpeechEnd)
//     vapi.on("call-end", onCallEnd)
//     vapi.on("message", onMessage)

//     // cleanup on unmount
//     return () => {
//       vapi.off("call-start", onCallStart)
//       vapi.off("speech-start", onSpeechStart)
//       vapi.off("speech-end", onSpeechEnd)
//       vapi.off("call-end", onCallEnd)
//       vapi.off("message", onMessage)
//     }
//     // empty deps: run once
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [vapiRef.current])

//   // Keep a debug effect to see React state changes (optional)
//   useEffect(() => {
//     if (!conversation) return
//     console.log("conversation (state updated):", conversation)
//   }, [conversation])

//   // GenerateFeedback accepts conversation param (prefer passing ref/param)
//   const GenerateFeedback = async (conv) => {
//     const payload = conv ?? conversationRef.current
//     if (!payload) {
//       console.warn("GenerateFeedback called with no conversation")
//       return
//     }
//     try {
//       const result = await axios.post('/api/ai-feedback', { conversation: payload })
//       console.log("Feedback Result:", result?.data)
//       const Content = result.data.reply.content
//       const FINAL_CONTENT = Content?.replace?.('```json', '')?.replace?.('```', '') ?? result.data
//       console.log("Final Content:", FINAL_CONTENT);
//       const{data,error}=await supabase
//       .from("interview-feedback")
//       .insert([
//         {
//           userName:interviewInfo?.userName,
//           userEmail:interviewInfo?.userEmail,
//           interview_id:interview_id,
//           feedback:JSON.parse(FINAL_CONTENT),
//           recommended:false
//         }
//       ])
//       .select();
//       console.log(data);
//       router.replace("/interview/"+interview_id+"/completed");
//       setLoading(true);

//     } catch (e) {
//       console.error("Feedback API error:", e)
//     }
//   }

//   return (
//     <div className='p-20 lg:px-48 xl:px-56'>
//       <h2 className='font-bold text-xl flex justify-center'>AI Interview Session
//         <span className='flex gap-2 items-center'>
//           <Timer />
//         </span>
//       </h2>

//       <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
//         <div className='bg-white h-[400px] rounded-lg border flex relative flex-col gap-3 items-center justify-center '>
//           <div className='relative'>
//             {!activeUser && <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />}
//             <Image src={'/ai.png'} alt='ai' width={100} height={100} className='w-[60px] h-[60px] rounded-full object-cover' />
//           </div>
//           <h2>AI Recruiter</h2>
//         </div>

//         <div className='bg-white h-[400px] relative rounded-lg border flex flex-col gap-3 items-center justify-center '>
//           <div className='relative'>
//             {activeUser && <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />}
//             <h2 className='text-2xl bg-primary text-white p-3 rounded-full px-6'>{interviewInfo?.userName?.[0]}</h2>
//           </div>
//           <h2>{interviewInfo?.userName}</h2>
//         </div>
//       </div>

//       <div className='flex items-center gap-5 justify-center mt-7'>
//         <Mic className='h-12 w-12 p-3 bg-gray-300 rounded-full cursor-pointer' />
//         {
//           !loading?
//           <AlertConfirmation stopInterview={() => stopInterview()}>
//           <Phone className='h-12 w-12 p-3 bg-red-300 text-white rounded-full cursor-pointer' />
//         </AlertConfirmation>
//         : <Loader2Icon className='animate-spin'/>
//         }
//       </div>

//       <h2 className='text-sm text-gray-400 text-center mt-5'>Interview in progress...</h2>
//     </div>
//   )
// }

// export default StartInterview


// "use client";
// import React, { useContext, useEffect, useRef, useState } from "react";
// import { InterviewDataContext } from "@/context/InterviewDataContext";
// import { AppContext } from "@/context/AppContext";
// import { Loader2Icon, Mic, Phone, Timer } from "lucide-react";
// import Vapi from "@vapi-ai/web";
// import AlertConfirmation from "./_components/AlertConfirmation";
// import { toast } from "sonner";
// import axios from "axios";
// import { supabase } from "@/services/supabaseclient";
// import { useParams, useRouter } from "next/navigation";

// const StartInterview = () => {
//   const { interviewInfo } = useContext(InterviewDataContext);
//   const { mode } = useContext(AppContext);
//   const isDark = mode === "dark";

//   const [conversation, setConversation] = useState(null);
//   const conversationRef = useRef(null); // synchronous ref
//   const [activeUser, setActiveUser] = useState(false);
//   const { interview_id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // create vapi once and persist it
//   const vapiRef = useRef(null);
//   if (!vapiRef.current) {
//     vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
//   }
//   const vapi = vapiRef.current;

//   // start call when interviewInfo is available
//   useEffect(() => {
//     if (interviewInfo) startCall();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [interviewInfo]);

//   const buildQuestionsString = (info) => {
//     const qArr =
//       info?.interviewData?.questionList ?? info?.questionList ?? [];
//     if (!Array.isArray(qArr)) return "";
//     return qArr.map((q) => q?.question ?? q).join("\n");
//   };

//   const startCall = async () => {
//     if (!interviewInfo) return;
//     const questionsText = buildQuestionsString(interviewInfo);
//     const assistantOptions = {
//       name: "AI Recruiter",
//       firstMessage: `Hi ${interviewInfo?.userName || "Candidate"}, ready for your interview?`,
//       model: {
//         provider: "openai",
//         model: "gpt-4o",
//         messages: [
//           {
//             role: "system",
//             content: `You are an AI interviewer. Ask these questions one at a time:\n\n${questionsText}`,
//           },
//         ],
//       },
//     };

//     try {
//       const res = await vapi.start(assistantOptions);
//       const callId =
//         res?.callId ??
//         res?.call_id ??
//         res?.id ??
//         res?.data?.call_id ??
//         null;
//       if (callId) console.log("FOUND callId:", callId);
//       else console.warn("No callId in vapi.start return");
//     } catch (err) {
//       console.error("vapi.start error (caught):", err);
//       toast.error("Failed to start interview — check console for details");
//     }
//   };

//   const stopInterview = () => {
//     console.log("stopInterview called, vapi instance:", vapi);
//     vapi?.stop?.();
//   };

//   // Attach listeners once and clean them up
//   useEffect(() => {
//     if (!vapi) return;

//     const onCallStart = () => {
//       console.log("Call started");
//       toast("Call connected");
//     };

//     const onSpeechStart = () => {
//       console.log("assistant Speech started");
//       setActiveUser(false);
//     };

//     const onSpeechEnd = () => {
//       console.log("Speech ended");
//       setActiveUser(true);
//     };

//     const onCallEnd = () => {
//       console.log("main Call ended");
//       toast("Call ended");

//       const latestConversation = conversationRef.current;
//       console.log("latestConversation (ref):", latestConversation);

//       if (latestConversation && latestConversation.length) {
//         // GenerateFeedback(latestConversation);
//       } else {
//         console.warn("No conversation available to send for feedback");
//       }
//     };

//     const onMessage = (msg) => {
//       if (msg?.type === "conversation-update" && Array.isArray(msg.conversation)) {
//         setConversation(msg.conversation);
//         conversationRef.current = msg.conversation;
//         console.log("fresh conversation (msg):", msg.conversation);
//       }
//     };

//     vapi.on("call-start", onCallStart);
//     vapi.on("speech-start", onSpeechStart);
//     vapi.on("speech-end", onSpeechEnd);
//     vapi.on("call-end", onCallEnd);
//     vapi.on("message", onMessage);

//     return () => {
//       vapi.off("call-start", onCallStart);
//       vapi.off("speech-start", onSpeechStart);
//       vapi.off("speech-end", onSpeechEnd);
//       vapi.off("call-end", onCallEnd);
//       vapi.off("message", onMessage);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [vapi]);

//   useEffect(() => {
//     if (!conversation) return;
//     console.log("conversation (state updated):", conversation);
//   }, [conversation]);

//   // GenerateFeedback accepts conversation param (prefer passing ref/param)
//   const GenerateFeedback = async (conv) => {
//     const payload = conv ?? conversationRef.current;
//     if (!payload) {
//       console.warn("GenerateFeedback called with no conversation");
//       return;
//     }
//     try {
//       setLoading(true);
//       const result = await axios.post("/api/ai-feedback", {
//         conversation: payload,
//       });
//       console.log("Feedback Result:", result?.data);
//       const Content = result.data.reply.content;
//       const FINAL_CONTENT =
//         Content?.replace?.("```json", "")?.replace?.("```", "") ??
//         result.data;
//       console.log("Final Content:", FINAL_CONTENT);

//       const parsed = JSON.parse(FINAL_CONTENT);

//       const { data, error } = await supabase
//         .from("debate-feedback")
//         .insert([
//           {
//             userName: interviewInfo?.userName,
//             userEmail: interviewInfo?.userEmail,
//             interview_id: interview_id,
//             feedback: parsed,
//             // recommended: false,
//           },
//         ])
//         .select();

//       console.log("saved feedback:", data);
//       // clear any session flags if you used them
//       try {
//         if (typeof window !== "undefined") {
//           sessionStorage.removeItem(`interview_started_${interview_id}`);
//           sessionStorage.removeItem(`interview_inprogress_${interview_id}`);
//         }
//       } catch (e) {
//         // ignore
//       }

//       router.replace(`/interview/${interview_id}/completed`);
//     } catch (e) {
//       console.error("Feedback API error:", e);
//       toast.error("Failed to generate feedback");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // helper: initials
//   const initials = (name) =>
//     name && typeof name === "string" ? name.trim()[0]?.toUpperCase() : "?";

//   return (
//     <div
//       className={`min-h-screen p-6 lg:px-48 xl:px-56 transition-colors duration-300 ${
//         isDark ? "bg-gray-950 text-gray-100" : "bg-indigo-50 text-gray-900"
//       }`}
//     >
//       <h2 className="font-bold text-xl flex items-center justify-center gap-3">
//         AI Interview Session
//         <span className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
//           <Timer />
//         </span>
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-6">
//         {/* AI Recruiter card */}
//         <div
//           className={`rounded-lg border h-[400px] flex flex-col items-center justify-center gap-4 relative p-6 transition-colors duration-300 ${
//             isDark
//               ? "bg-gray-900 border-gray-700"
//               : "bg-white border-gray-200"
//           }`}
//         >
//           <div className="relative flex items-center justify-center">
//             {!activeUser && (
//               <span
//                 aria-hidden
//                 className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping"
//               />
//             )}
//             <div
//               aria-hidden
//               className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold ${
//                 isDark ? "bg-gradient-to-tr from-indigo-700 to-purple-600 text-white" : "bg-indigo-500 text-white"
//               }`}
//             >
//               AI
//             </div>
//           </div>
//           <h3 className="font-semibold">{/* role */}AI Debater</h3>
//           <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
//             The AI will debate with you.
//           </p>
//         </div>

//         {/* Candidate card */}
//         <div
//           className={`rounded-lg border h-[400px] flex flex-col items-center justify-center gap-4 relative p-6 transition-colors duration-300 ${
//             isDark
//               ? "bg-gray-900 border-gray-700"
//               : "bg-white border-gray-200"
//           }`}
//         >
//           <div className="relative flex items-center justify-center">
//             {activeUser && (
//               <span
//                 aria-hidden
//                 className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping"
//               />
//             )}
//             <div
//               className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold ${
//                 isDark ? "bg-gray-800 text-indigo-300" : "bg-primary text-white"
//               }`}
//             >
//               {initials(interviewInfo?.userName)}
//             </div>
//           </div>
//           <h3 className="font-semibold">{interviewInfo?.userName ?? "Candidate"}</h3>
//           <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
//             {interviewInfo?.userEmail ?? ""}
//           </p>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex items-center gap-5 justify-center mt-8">
//         <button
//           aria-label="toggle-mic"
//           className={`p-3 rounded-full focus:outline-none transition-colors duration-200 ${
//             isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800 shadow"
//           }`}
//         >
//           <Mic className={`w-6 h-6 ${isDark ? "text-gray-100" : "text-gray-700"}`} />
//         </button>

//         <div className="flex items-center gap-4">
//           {!loading ? (
//             <AlertConfirmation stopInterview={() => stopInterview()}>
//               <button
//                 aria-label="end-call"
//                 className={`p-3 rounded-full focus:outline-none transition-colors duration-200 ${
//                   isDark
//                     ? "bg-red-600 text-white hover:bg-red-500"
//                     : "bg-red-500 text-white hover:bg-red-600"
//                 }`}
//               >
//                 <Phone className="w-6 h-6" />
//               </button>
//             </AlertConfirmation>
//           ) : (
//             <div className="w-12 h-12 flex items-center justify-center">
//               <Loader2Icon className="animate-spin" />
//             </div>
//           )}
//         </div>
//       </div>

//       <h2 className={`text-sm text-center mt-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
//         {loading ? "Finishing up..." : "Debate in progress..."}
//       </h2>
//     </div>
//   );
// };

// export default StartInterview;

"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { AppContext } from "@/context/AppContext";
import { Loader2Icon, Mic, Phone, Timer } from "lucide-react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/services/supabaseclient";
import { useParams, useRouter } from "next/navigation";

const StartInterview = () => {
  const { interviewInfo } = useContext(InterviewDataContext);
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  const [conversation, setConversation] = useState(null);
  const conversationRef = useRef(null);
  const [activeUser, setActiveUser] = useState(false);
  const { interview_id } = useParams();
  const [loading, setLoading] = useState(false); // general loading
  const [finishing, setFinishing] = useState(false); // overlay active
  const router = useRouter();

  // create vapi once and persist it
  const vapiRef = useRef(null);
  if (!vapiRef.current) {
    vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  }
  const vapi = vapiRef.current;

  // start call when interviewInfo is available
  useEffect(() => {
    if (interviewInfo) startCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewInfo]);

  const buildQuestionsString = (info) => {
    const qArr =
      info?.interviewData?.questionList ?? info?.questionList ?? [];
    if (!Array.isArray(qArr)) return "";
    return qArr.map((q) => q?.question ?? q).join("\n");
  };

  const startCall = async () => {
    if (!interviewInfo) return;
    const questionsText = buildQuestionsString(interviewInfo);
    // const assistantOptions = {
    //   name: "AI Recruiter",
    //   firstMessage: `Hi ${interviewInfo?.userName || "Candidate"}, ready for your interview?`,
    //   model: {
    //     provider: "openai",
    //     model: "gpt-4o",
    //     messages: [
    //       {
    //         role: "system",
    //         content: `You are an AI interviewer. Ask these questions one at a time:\n\n${questionsText}`,
    //       },
    //     ],
    //   },
    // };

  const assistantOptions = {
  name: "AI Debater",
  firstMessage: `Hi ${interviewInfo?.userName || "Participant"}, let's begin our debate on "${interviewInfo?.interviewData?.topic}". You may start whenever you're ready.`,
  model: {
    provider: "openai",
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
You are an AI debate partner participating in a live debate with a human.

DEBATE RULES:
- Speak one point at a time.
- Keep responses short, clear, and natural.
- Use the provided debate points as guidelines, but respond naturally to the user's statements.
- If the user argues "For", you respond with an "Against" counter.
- If the user argues "Against", you respond with a "For" counter.
- If the user makes a generic statement, choose the most relevant rebuttal.
- Do NOT list points. Debate conversationally.
- Avoid long paragraphs; respond in 2–3 sentences maximum.

DEBATE POINTS (reference only — use these to build natural arguments):
${questionsText}

Your task:
Carry a natural back-and-forth debate with the user, responding with counters to their arguments and challenging their viewpoints respectfully.
        `,
      }
    ],
  },
};


    try {
      const res = await vapi.start(assistantOptions);
      const callId =
        res?.callId ??
        res?.call_id ??
        res?.id ??
        res?.data?.call_id ??
        null;
      if (callId) console.log("FOUND callId:", callId);
      else console.warn("No callId in vapi.start return");
    } catch (err) {
      console.error("vapi.start error (caught):", err);
      toast.error("Failed to start interview — check console for details");
    }
  };

  const stopInterview = () => {
    console.log("stopInterview called, vapi instance:", vapi);
    vapi?.stop?.();
  };

  // Attach listeners once and clean them up
  useEffect(() => {
    if (!vapi) return;

    const onCallStart = () => {
      console.log("Call started");
      toast("Call connected");
    };

    const onSpeechStart = () => {
      console.log("assistant Speech started");
      setActiveUser(false);
    };

    const onSpeechEnd = () => {
      console.log("Speech ended");
      setActiveUser(true);
    };

    const onCallEnd = async () => {
      console.log("main Call ended");
      // show overlay and prevent pulse animations
      setFinishing(true);

      // grab the freshest conversation synchronously
      const latestConversation = conversationRef.current;
      console.log("latestConversation (ref):", latestConversation);

      if (latestConversation && latestConversation.length) {
        try {
          // wait for GenerateFeedback to complete (it now returns a boolean)
          const ok = await GenerateFeedback(latestConversation);
          if (ok) {
            // Navigate after feedback saved
            router.replace(`/interview/${interview_id}/completed`);
            return;
          } else {
            toast.error("Failed to generate feedback");
          }
        } catch (e) {
          console.error("onCallEnd -> GenerateFeedback error:", e);
          toast.error("Error while generating feedback");
        }
      } else {
        console.warn("No conversation available to send for feedback");
        toast.error("No conversation captured — cannot generate feedback");
      }

      // if we reach here something went wrong — remove overlay so user can retry or leave
      setFinishing(false);
    };

    const onMessage = (msg) => {
      if (msg?.type === "conversation-update" && Array.isArray(msg.conversation)) {
        setConversation(msg.conversation);
        conversationRef.current = msg.conversation;
        console.log("fresh conversation (msg):", msg.conversation);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vapi]);

  useEffect(() => {
    if (!conversation) return;
    console.log("conversation (state updated):", conversation);
  }, [conversation]);

  // GenerateFeedback now returns true/false and DOES NOT route.
  const GenerateFeedback = async (conv) => {
    const payload = conv ?? conversationRef.current;
    if (!payload) {
      console.warn("GenerateFeedback called with no conversation");
      return false;
    }
    try {
      setLoading(true);
      // call your feedback API
      const result = await axios.post("/api/ai-feedback", {
        conversation: payload,
      });
      console.log("Feedback Result:", result?.data);
      const Content = result?.data?.reply?.content;
      const FINAL_CONTENT =
        typeof Content === "string"
          ? Content.replace("```json", "").replace("```", "").trim()
          : result.data;
      console.log("Final Content:", FINAL_CONTENT);

      // parse
      let parsed;
      try {
        parsed = typeof FINAL_CONTENT === "string" ? JSON.parse(FINAL_CONTENT) : FINAL_CONTENT;
      } catch (e) {
        console.error("Failed to parse feedback JSON:", e);
        // If parsing fails, still save raw content
        parsed = { raw: FINAL_CONTENT };
      }

      const { data, error } = await supabase
        .from("debate-feedback")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: interview_id,
            feedback: parsed,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        return false;
      }

      console.log("saved feedback:", data);

      
    // 4) Update Interviews.completed = true for this interview
    const { data: updData, error: updError } = await supabase
      .from("Interviews")
      .update({ completed: true })
      .eq("interview_id", interview_id)
      .select();

    if (updError) {
      console.error("Supabase update (Interviews) error:", updError);
      // we inserted feedback but failed to mark completed — still return false so caller can handle
      return false;
    }

    console.log("updated interview row to completed:", updData);
    
      // cleanup optional flags
      try {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(`interview_started_${interview_id}`);
          sessionStorage.removeItem(`interview_inprogress_${interview_id}`);
        }
      } catch (e) {
        // ignore
      }

      return true;
    } catch (e) {
      console.error("Feedback API error:", e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // helper: initials
  const initials = (name) =>
    name && typeof name === "string" ? name.trim()[0]?.toUpperCase() : "?";

  return (
    <div
      className={`min-h-screen p-6 lg:px-48 xl:px-56 transition-colors duration-300 ${
        isDark ? "bg-gray-950 text-gray-100" : "bg-indigo-50 text-gray-900"
      }`}
    >
      <h2 className="font-bold text-xl flex items-center justify-center gap-3">
        AI Debate Session
        <span className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
          <Timer />
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-6">
        {/* AI Debater card */}
        <div
          className={`rounded-lg border h-[400px] flex flex-col items-center justify-center gap-4 relative p-6 transition-colors duration-300 ${
            isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="relative flex items-center justify-center">
            {/* pulse is hidden while finishing */}
            {!activeUser && !finishing && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping"
              />
            )}
            <div
              aria-hidden
              className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold ${
                isDark ? "bg-gradient-to-tr from-indigo-700 to-purple-600 text-white" : "bg-indigo-500 text-white"
              }`}
            >
              AI
            </div>
          </div>
          <h3 className="font-semibold">AI Debater</h3>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
            The AI will debate with you.
          </p>
        </div>

        {/* Candidate card */}
        <div
          className={`rounded-lg border h-[400px] flex flex-col items-center justify-center gap-4 relative p-6 transition-colors duration-300 ${
            isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="relative flex items-center justify-center">
            {/* user pulse is hidden while finishing */}
            {activeUser && !finishing && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping"
              />
            )}
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold ${
                isDark ? "bg-gray-800 text-indigo-300" : "bg-primary text-white"
              }`}
            >
              {initials(interviewInfo?.userName)}
            </div>
          </div>
          <h3 className="font-semibold">{interviewInfo?.userName ?? "Participant"}</h3>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
            {interviewInfo?.userEmail ?? ""}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-5 justify-center mt-8">
        <button
          aria-label="toggle-mic"
          className={`p-3 rounded-full focus:outline-none transition-colors duration-200 ${
            isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800 shadow"
          }`}
          disabled={finishing}
        >
          <Mic className={`w-6 h-6 ${isDark ? "text-gray-100" : "text-gray-700"}`} />
        </button>

        <div className="flex items-center gap-4">
          {!loading ? (
            <AlertConfirmation stopInterview={() => stopInterview()}>
              <button
                aria-label="end-call"
                className={`p-3 rounded-full focus:outline-none transition-colors duration-200 ${
                  isDark
                    ? "bg-red-600 text-white hover:bg-red-500"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                disabled={finishing}
              >
                <Phone className="w-6 h-6" />
              </button>
            </AlertConfirmation>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center">
              <Loader2Icon className="animate-spin" />
            </div>
          )}
        </div>
      </div>

      <h2 className={`text-sm text-center mt-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {loading ? "Finishing up..." : "Debate in progress..."}
      </h2>

      {/* FULL-SCREEN GLASSMORPHIC OVERLAY (visible while finishing) */}
      {finishing && (
        <div
          aria-hidden
          className={`fixed inset-0 z-[2000] flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ${
            isDark ? "bg-black/40" : "bg-white/30"
          }`}
        >
          <div
            className={`max-w-sm w-full mx-4 rounded-xl p-6 flex flex-col items-center gap-4 text-center ${
              isDark ? "bg-white/6 border border-gray-700" : "bg-white/60 border border-gray-200"
            }`}
            style={{ backdropFilter: "blur(10px)" }}
          >
            <Loader2Icon className="animate-spin w-10 h-10" />
            <h3 className="font-semibold">{`Generating feedback…`}</h3>
            <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
              This may take a few seconds. Please do not close the tab.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartInterview;

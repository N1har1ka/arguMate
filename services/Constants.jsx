import { BriefcaseBusinessIcon, Calendar, Code2Icon, LayoutDashboard, List, Puzzle, Settings, User2Icon, WalletCards } from "lucide-react";

export const SideBarOptions=[
    {
        name:"Dashboard",
        icon:LayoutDashboard,
        path:"/dashboard"
    },
    {
        name:"Scheduled Debate",
        icon:Calendar,
        path:"/dashboard/scheduled-debate"
    },
    {
        name:"All Debates",
        icon:List,
        path:"/dashboard/all-debates"
    },
    // {
    //     name:"Billing",
    //     icon:WalletCards,
    //     path:'/dashboard/billing'
    // },
    {
        name:"Settings",
        icon:Settings,
        path:'/dashboard/settings'
    }
]
export const InterviewType=[
    {  
        title:"Beginner",
        icon:Puzzle
    },
    {  
        title:"Intermediate",
        icon:User2Icon
    },
    {  
        title:"Advanced",
        icon:Code2Icon
    }
]

// export const QUESTIONS_PROMPT=`You are an expert technical interviewer.

// Based on the following inputs, generate a well-structured list of high-quality interview questions:

// Job Title: {{jobTitle}}
// Job Description: {{jobDescription}}
// Interview Duration: {{duration}}
// Interview Type: {{type}}

// Your task:
// - Analyze the job description to identify key responsibilities, required skills, and expected experience.
// - Generate a list of interview questions based on the interview duration.
// - Adjust the number and depth of questions to match the interview duration.
// - Ensure the questions match the tone and structure of a real-life {{type}} interview.

// Format your response in JSON format with an array list of questions.
// Format: interviewQuestions = [
//   {
//     question: "",
//     type: "Technical / Behavioral / Experience / Problem Solving / Leadership"
//   },
//   {
//     ...
//   }
// ]

// The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`;


export const DEBATE_POINTS_PROMPT = `
You are an expert debate coach who generates simple, clear, and beginner-friendly debate points.

Based on the following inputs, produce a set of debate points:

Field: {{field}}
Debate Topic: {{topic}}
Debate Duration: {{duration}}
Difficulty: {{difficulty}}

Your task:
- Create simple, easy-to-speak debate points.
- Each point should be 1–3 short sentences (not long paragraphs).
- Points must be clear enough for both AI and a regular user to understand quickly.
- Provide a balanced set of points for ALL types: For, Against, and Rebuttal.
- Rebuttals should counter common arguments from the opposite side.
- Ensure the points match the difficulty level provided.
- Avoid complex jargon, technical details, or heavy analysis.

FORMAT:
Return ONLY a JSON array of objects like this:

[
  {
    "point": "Some argument here in 1–3 simple lines.",
    "type": "For"
  },
  {
    "point": "Another argument.",
    "type": "Against"
  },
  {
    "point": "A rebuttal statement.",
    "type": "Rebuttal"
  }
]

RULES:
- Generate points that are structured, relevant, and time-optimized
- Include points of all three types: For, Against, Rebuttal.
- Keep the language direct, human, natural, and debate-ready.
- No long paragraphs. No nested objects.
- No markdown. Only pure JSON.
`;


// export const FEEDBACK_PROMPT=`{{conversation}}
// Depends on this Interview Conversation between assistant and user,
// Give me feedback for user interview. Give me rating out of 10 for technical Skills,
// Communication, Problem Solving, Experience. Also give me summery in 3 lines
// about the interview and one line to let me know whether is recommanded
// for hire or not with msg. Give me response in JSON format

// {
//     feedback:{
//         rating:{
//             technicalSkills:5,
//             communication:6,
//             problemSolving:4,
//             experince:7
//         },
//         summery:<in 3 Line>,
//         Recommendation:"",
//         RecommendationMsg:""
//     }
// }
// `

export const DEBATE_FEEDBACK_PROMPT = `
{{conversation}}

Based on the above debate conversation between the AI and the user, generate clear, constructive feedback that helps the user improve their debating skills.

Your goals:
- Evaluate the user's debating ability in simple, easy-to-understand language.
- Score the user out of 10 in the following areas:
  - Clarity (how clearly they expressed ideas)
  - Reasoning (logic and strength of arguments)
  - Confidence (tone, delivery, and assertiveness)
  - Engagement (how well they responded and stayed active)

- Provide:
  1. A short 2–3 sentence summary of the user's overall performance.
  2. A list of **strengths** (what they did well).
  3. A list of **improvementPoints** (what they should improve, explained simply).

RULES:
- Keep every point beginner-friendly and short (1–2 sentences max).
- Focus on correction and guidance — no judging, no hiring language.
- Do NOT give long paragraphs.
- NO markdown.
- Respond ONLY with valid JSON.

Return the response in the exact format below:

{
  "feedback": {
    "rating": {
      "clarity": 7,
      "reasoning": 6,
      "confidence": 5,
      "engagement": 7
    },
    "summary": "<2–3 sentence overview>",
    "strengths": [
      "<short strength point>",
      "<short strength point>"
    ],
    "improvementPoints": [
      "<short improvement point>",
      "<short improvement point>"
    ]
  }
}
`;

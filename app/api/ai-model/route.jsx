import { DEBATE_POINTS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
    const {field,topic,duration,type}=await req.json();
    const FINAL_PROMPT=DEBATE_POINTS_PROMPT
    .replace('{{field}}',field)
    .replace('{{topic}}',topic)
    .replace('{{duration}}',duration)
    .replace('{{type}}',type)

    try{
    const openai=new OpenAI({
        baseURL:'https://openrouter.ai/api/v1',
        apiKey:process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-exp:free",
    messages: [
      { role: "user", content: FINAL_PROMPT }
    ],
    })
    console.log(completion.choices[0].message)
    return NextResponse.json(completion.choices[0].message);
}catch(e){
    console.log("error",e);
    return NextResponse.json(e);
}
}

import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Missing API Key: GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY is not defined." });
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    return NextResponse.json({
      status: res.status,
      statusText: res.statusText,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

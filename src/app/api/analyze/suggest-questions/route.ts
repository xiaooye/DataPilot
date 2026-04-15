import { NextResponse } from "next/server";
import { createAIClient, AI_MODEL, getUserApiKey } from "@/lib/claude";
import { buildSuggestedQuestionsPrompt } from "@/lib/prompts";
import type { ColumnMeta, Insight, Summary } from "@/types";

interface SuggestBody {
  columns: ColumnMeta[];
  summary: Summary;
  insights: Insight[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SuggestBody;

    if (!body.columns?.length || !body.summary || !body.insights) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const client = createAIClient(getUserApiKey(request));
    const prompt = buildSuggestedQuestionsPrompt(
      body.columns,
      body.summary,
      body.insights,
    );

    const response = await client.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0]?.message?.content ?? "[]";

    const match = text.match(/\[[\s\S]*\]/);
    const questions: string[] = match ? JSON.parse(match[0]) : [];

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Suggest questions error:", err);
    return NextResponse.json({ questions: [] });
  }
}

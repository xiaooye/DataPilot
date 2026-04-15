import { NextResponse } from "next/server";
import { createAIClient, AI_MODEL, parseAnalysisJSON } from "@/lib/claude";
import { buildAnalysisPrompt } from "@/lib/prompts";
import type { ColumnMeta } from "@/types";

export const maxDuration = 30;

interface AnalyzeBody {
  columns: ColumnMeta[];
  sampleRows: Record<string, unknown>[];
  rowCount: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeBody;

    if (!body.columns?.length || !body.sampleRows?.length || !body.rowCount) {
      return NextResponse.json(
        { error: "Missing required fields: columns, sampleRows, rowCount" },
        { status: 400 },
      );
    }

    const client = createAIClient();
    const { system, user } = buildAnalysisPrompt(
      body.columns,
      body.sampleRows,
      body.rowCount,
    );

    const response = await client.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 4096,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const text = response.choices[0]?.message?.content ?? "";
    if (!text) {
      return NextResponse.json(
        { error: "No response from AI model." },
        { status: 502 },
      );
    }

    const result = parseAnalysisJSON(text);

    if (!result.summary) {
      return NextResponse.json(
        { error: "AI returned an unparseable response. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };

    if (error.status === 401) {
      return NextResponse.json(
        { error: "Invalid API key. Check your OPENROUTER_API_KEY." },
        { status: 401 },
      );
    }
    if (error.status === 429) {
      return NextResponse.json(
        { error: "Rate limited. Please wait a moment and try again." },
        { status: 429 },
      );
    }

    console.error("Analyze error:", error.message ?? err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 },
    );
  }
}

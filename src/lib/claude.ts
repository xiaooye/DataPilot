import OpenAI from "openai";
import type { Anomaly, ChartSpec, Insight, Summary } from "@/types";

export function createAIClient(apiKey?: string): OpenAI {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey || process.env.OPENROUTER_API_KEY,
  });
}

/** Extract a user-provided API key from the request, if present. */
export function getUserApiKey(request: Request): string | undefined {
  const key = request.headers.get("x-api-key");
  return key && key.trim().length > 0 ? key.trim() : undefined;
}

// Free model on OpenRouter with large context
export const AI_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

export interface AnalysisResult {
  summary: Summary | null;
  insights: Insight[];
  charts: ChartSpec[];
  anomalies: Anomaly[];
}

/** Parse the structured JSON analysis from the model's text response. */
export function parseAnalysisJSON(text: string): AnalysisResult {
  const empty: AnalysisResult = {
    summary: null,
    insights: [],
    charts: [],
    anomalies: [],
  };

  try {
    // Strip markdown code fences if present
    let json = text.trim();
    if (json.startsWith("```")) {
      json = json.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(json);

    return {
      summary: parsed.summary
        ? {
            title: String(parsed.summary.title ?? ""),
            description: String(parsed.summary.description ?? ""),
            rowCount: Number(parsed.summary.rowCount ?? 0),
            columnCount: Number(parsed.summary.columnCount ?? 0),
            timeRange: parsed.summary.timeRange
              ? String(parsed.summary.timeRange)
              : undefined,
            dataQuality:
              (parsed.summary.dataQuality as Summary["dataQuality"]) ?? "fair",
          }
        : null,

      insights: Array.isArray(parsed.insights)
        ? parsed.insights.map((i: Record<string, unknown>) => ({
            text: String(i.text ?? ""),
            importance:
              (i.importance as Insight["importance"]) ?? "medium",
            category:
              (i.category as Insight["category"]) ?? "distribution",
          }))
        : [],

      charts: Array.isArray(parsed.charts)
        ? parsed.charts.map((c: Record<string, unknown>) => ({
            type: (c.type as ChartSpec["type"]) ?? "bar",
            title: String(c.title ?? ""),
            xColumn: String(c.xColumn ?? ""),
            yColumn: String(c.yColumn ?? ""),
            groupBy: c.groupBy ? String(c.groupBy) : undefined,
            description: c.description ? String(c.description) : undefined,
          }))
        : [],

      anomalies: Array.isArray(parsed.anomalies)
        ? parsed.anomalies.map((a: Record<string, unknown>) => ({
            column: String(a.column ?? ""),
            issue: String(a.issue ?? ""),
            severity: (a.severity as Anomaly["severity"]) ?? "info",
            affectedRows: a.affectedRows
              ? Number(a.affectedRows)
              : undefined,
          }))
        : [],
    };
  } catch {
    // Try to extract JSON from a larger text response
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return parseAnalysisJSON(match[0]);
      } catch {
        // fall through
      }
    }
    return empty;
  }
}

/** Extract chart specs from ```chart fenced code blocks in streaming text. */
export function extractInlineCharts(text: string): ChartSpec[] {
  const charts: ChartSpec[] = [];
  const pattern = /```chart\n([\s\S]*?)\n```/g;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      charts.push({
        type: (parsed.type as ChartSpec["type"]) ?? "bar",
        title: String(parsed.title ?? ""),
        xColumn: String(parsed.xColumn ?? ""),
        yColumn: String(parsed.yColumn ?? ""),
        groupBy: parsed.groupBy ? String(parsed.groupBy) : undefined,
        description: parsed.description
          ? String(parsed.description)
          : undefined,
      });
    } catch {
      // Skip malformed chart specs
    }
  }
  return charts;
}

/** Strip ```chart blocks from text for display. */
export function stripChartBlocks(text: string): string {
  return text.replace(/```chart\n[\s\S]*?\n```/g, "").trim();
}

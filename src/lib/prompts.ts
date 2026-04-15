import type { ColumnMeta, Insight, Summary } from "@/types";

// ── Prompt builders ─────────────────────────────────────────────

function formatColumnStats(columns: ColumnMeta[]): string {
  return columns
    .map((col) => {
      let line = `- **${col.name}** (${col.type})`;
      line += `: ${col.uniqueCount} unique, ${col.nullCount} nulls`;
      if (col.type === "number" && col.min !== undefined) {
        line += `, range [${col.min} – ${col.max}], mean=${col.mean}, median=${col.median}`;
      }
      if (col.type === "date" && col.min !== undefined) {
        line += `, range ${col.min} to ${col.max}`;
      }
      if (col.distribution.length > 0) {
        const top = col.distribution
          .slice(0, 5)
          .map((d) => `${d.value}(${d.count})`)
          .join(", ");
        line += ` | top values: ${top}`;
      }
      return line;
    })
    .join("\n");
}

function formatSampleRows(
  rows: Record<string, unknown>[],
  columns: ColumnMeta[],
): string {
  const cols = columns.map((c) => c.name);
  const header = `| ${cols.join(" | ")} |`;
  const sep = `| ${cols.map(() => "---").join(" | ")} |`;
  const body = rows
    .slice(0, 20)
    .map((row) => `| ${cols.map((c) => String(row[c] ?? "")).join(" | ")} |`)
    .join("\n");
  return `${header}\n${sep}\n${body}`;
}

export function buildAnalysisPrompt(
  columns: ColumnMeta[],
  sampleRows: Record<string, unknown>[],
  rowCount: number,
): { system: string; user: string } {
  const system = `You are DataPilot, an expert data analyst. You analyze CSV datasets and return structured JSON analysis.

You MUST respond with ONLY a JSON object (no markdown, no explanation, no code fences) in this exact format:
{
  "summary": {
    "title": "descriptive title",
    "description": "2-3 sentence overview",
    "rowCount": number,
    "columnCount": number,
    "timeRange": "date range if applicable, or null",
    "dataQuality": "excellent" | "good" | "fair" | "poor"
  },
  "insights": [
    { "text": "specific finding", "importance": "high" | "medium" | "low", "category": "trend" | "outlier" | "correlation" | "distribution" | "quality" }
  ],
  "charts": [
    { "type": "bar" | "line" | "pie" | "scatter", "title": "chart title", "xColumn": "column_name", "yColumn": "column_name", "groupBy": "column_name or null", "description": "what this shows" }
  ],
  "anomalies": [
    { "column": "column_name", "issue": "description", "severity": "warning" | "error" | "info", "affectedRows": number }
  ]
}

Rules:
- Be specific and quantitative. Reference actual column names and values.
- Suggest 2-4 charts that reveal the most interesting patterns.
- Include 4-6 insights ordered by importance.
- If data is clean, return an empty anomalies array.
- Respond with ONLY valid JSON. No text before or after.`;

  const user = `Analyze this dataset (${rowCount} total rows).

## Column Statistics
${formatColumnStats(columns)}

## Sample Rows (first 20 of ${sampleRows.length} sampled)
${formatSampleRows(sampleRows, columns)}`;

  return { system, user };
}

export function buildChatSystemPrompt(
  columns: ColumnMeta[],
  summary: Summary,
): string {
  return `You are DataPilot, an expert data analyst helping a user explore their dataset.

## Dataset Context
**${summary.title}**: ${summary.description}
- ${summary.rowCount} rows, ${summary.columnCount} columns
- Data quality: ${summary.dataQuality}
${summary.timeRange ? `- Time range: ${summary.timeRange}` : ""}

## Column Statistics
${formatColumnStats(columns)}

Rules:
- Answer questions about the data concisely and accurately.
- Reference specific column names and values.
- Use markdown formatting for clarity (bold, lists, tables).
- When a visualization would help, include a chart spec in a fenced code block tagged "chart":

\`\`\`chart
{"type":"bar","title":"Title","xColumn":"col","yColumn":"col","description":"what it shows"}
\`\`\`

Only include a chart block when it genuinely adds value to your answer.`;
}

export function buildSuggestedQuestionsPrompt(
  columns: ColumnMeta[],
  summary: Summary,
  insights: Insight[],
): string {
  const insightText = insights
    .slice(0, 4)
    .map((i) => `- ${i.text}`)
    .join("\n");

  return `Given this dataset and analysis, suggest 3-4 follow-up questions a user might want to ask.

Dataset: "${summary.title}" — ${summary.description}
Columns: ${columns.map((c) => c.name).join(", ")}
Key insights:
${insightText}

Return ONLY a JSON array of question strings. No explanation. Example:
["What is the average revenue by region?", "Is there a correlation between X and Y?"]`;
}

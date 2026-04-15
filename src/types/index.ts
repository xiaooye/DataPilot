export type ColumnType = "number" | "date" | "string" | "boolean";

export interface ColumnMeta {
  name: string;
  type: ColumnType;
  nullCount: number;
  uniqueCount: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  median?: number;
  distribution: Array<{ value: string; count: number }>;
}

export interface ParsedDataset {
  rows: Record<string, unknown>[];
  columns: ColumnMeta[];
  rowCount: number;
  fileName: string;
  fileSize: number;
}

export interface Summary {
  title: string;
  description: string;
  rowCount: number;
  columnCount: number;
  timeRange?: string;
  dataQuality: "excellent" | "good" | "fair" | "poor";
}

export interface Insight {
  text: string;
  importance: "high" | "medium" | "low";
  category: "trend" | "outlier" | "correlation" | "distribution" | "quality";
}

export interface ChartSpec {
  type: "bar" | "line" | "pie" | "scatter";
  title: string;
  xColumn: string;
  yColumn: string;
  groupBy?: string;
  description?: string;
}

export interface Anomaly {
  column: string;
  issue: string;
  severity: "warning" | "error" | "info";
  affectedRows?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  charts?: ChartSpec[];
  timestamp: number;
}

export type AnalysisStatus =
  | "idle"
  | "uploading"
  | "parsing"
  | "analyzing"
  | "ready"
  | "error";

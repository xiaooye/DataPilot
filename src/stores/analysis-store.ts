import { create } from "zustand";
import type {
  AnalysisStatus,
  Anomaly,
  ChartSpec,
  ChatMessage,
  ColumnMeta,
  Insight,
  ParsedDataset,
  Summary,
} from "@/types";

interface AnalysisState {
  rawData: Record<string, unknown>[];
  columns: ColumnMeta[];
  fileName: string;
  fileSize: number;
  rowCount: number;
  summary: Summary | null;
  insights: Insight[];
  charts: ChartSpec[];
  anomalies: Anomaly[];
  messages: ChatMessage[];
  suggestedQuestions: string[];
  status: AnalysisStatus;
  error: string | null;

  setDataset: (dataset: ParsedDataset) => void;
  setAnalysis: (data: {
    summary: Summary | null;
    insights: Insight[];
    charts: ChartSpec[];
    anomalies: Anomaly[];
  }) => void;
  setSuggestedQuestions: (questions: string[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  addChartToLastMessage: (chart: ChartSpec) => void;
  setStatus: (status: AnalysisStatus) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  rawData: [],
  columns: [],
  fileName: "",
  fileSize: 0,
  rowCount: 0,
  summary: null,
  insights: [],
  charts: [],
  anomalies: [],
  messages: [],
  suggestedQuestions: [],
  status: "idle" as AnalysisStatus,
  error: null,
};

export const useAnalysisStore = create<AnalysisState>()((set) => ({
  ...initialState,

  setDataset: (dataset) =>
    set({
      rawData: dataset.rows,
      columns: dataset.columns,
      fileName: dataset.fileName,
      fileSize: dataset.fileSize,
      rowCount: dataset.rowCount,
      status: "parsing",
      error: null,
    }),

  setAnalysis: ({ summary, insights, charts, anomalies }) =>
    set({
      summary,
      insights,
      charts,
      anomalies,
      status: "ready",
    }),

  setSuggestedQuestions: (questions) => set({ suggestedQuestions: questions }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = { ...last, content };
      }
      return { messages };
    }),

  addChartToLastMessage: (chart) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = {
          ...last,
          charts: [...(last.charts ?? []), chart],
        };
      }
      return { messages };
    }),

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error, status: error ? "error" : "idle" }),

  reset: () => set(initialState),
}));

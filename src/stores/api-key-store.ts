import { create } from "zustand";

const STORAGE_KEY = "datapilot-api-key";

interface ApiKeyState {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

function loadKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function saveKey(key: string) {
  try {
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable
  }
}

export const useApiKeyStore = create<ApiKeyState>()((set) => ({
  apiKey: loadKey(),

  setApiKey: (key: string) => {
    saveKey(key);
    set({ apiKey: key });
  },

  clearApiKey: () => {
    saveKey("");
    set({ apiKey: "" });
  },
}));

/** Build headers object with the user's API key if set. */
export function apiHeaders(
  extra?: Record<string, string>,
): Record<string, string> {
  const key = useApiKeyStore.getState().apiKey;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };
  if (key) {
    headers["x-api-key"] = key;
  }
  return headers;
}

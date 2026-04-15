import Papa from "papaparse";
import type { ColumnMeta, ColumnType, ParsedDataset } from "@/types";
import { mean, median } from "@/lib/data-utils";

const MAX_ROWS = 10_000;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function parseCSV(file: File): Promise<ParsedDataset> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 50 MB.`));
      return;
    }

    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      preview: MAX_ROWS,
      complete(results) {
        if (results.errors.length > 0 && results.data.length === 0) {
          reject(new Error(`Failed to parse CSV: ${results.errors[0].message}`));
          return;
        }

        const rows = results.data;
        if (rows.length === 0) {
          reject(new Error("CSV file is empty or has no data rows."));
          return;
        }

        const columnNames = results.meta.fields ?? Object.keys(rows[0]);
        const columns = columnNames.map((name) => analyzeColumn(name, rows));

        resolve({
          rows,
          columns,
          rowCount: rows.length,
          fileName: file.name,
          fileSize: file.size,
        });
      },
      error(err) {
        reject(new Error(`Failed to parse CSV: ${err.message}`));
      },
    });
  });
}

function analyzeColumn(
  name: string,
  rows: Record<string, unknown>[],
): ColumnMeta {
  const values = rows.map((row) => row[name]);
  const nonNull = values.filter(
    (v) => v !== null && v !== undefined && v !== "",
  );
  const nullCount = values.length - nonNull.length;

  const type = detectType(nonNull);

  const uniqueValues = new Set(nonNull.map(String));
  const uniqueCount = uniqueValues.size;

  // Distribution: top 10 values by frequency
  const freq = new Map<string, number>();
  for (const v of nonNull) {
    const key = String(v);
    freq.set(key, (freq.get(key) ?? 0) + 1);
  }
  const distribution = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([value, count]) => ({ value, count }));

  const meta: ColumnMeta = {
    name,
    type,
    nullCount,
    uniqueCount,
    distribution,
  };

  if (type === "number") {
    const nums = nonNull.filter((v) => typeof v === "number") as number[];
    if (nums.length > 0) {
      meta.min = Math.min(...nums);
      meta.max = Math.max(...nums);
      meta.mean = Math.round(mean(nums) * 100) / 100;
      meta.median = Math.round(median(nums) * 100) / 100;
    }
  }

  if (type === "date") {
    const dates = nonNull
      .map((v) => new Date(String(v)))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
    if (dates.length > 0) {
      meta.min = dates[0].toISOString().split("T")[0];
      meta.max = dates[dates.length - 1].toISOString().split("T")[0];
    }
  }

  return meta;
}

function detectType(values: unknown[]): ColumnType {
  if (values.length === 0) return "string";

  let numCount = 0;
  let dateCount = 0;
  let boolCount = 0;

  for (const v of values) {
    if (typeof v === "number" && isFinite(v)) {
      numCount++;
    } else if (typeof v === "boolean") {
      boolCount++;
    } else {
      const s = String(v).trim().toLowerCase();

      if (s === "true" || s === "false" || s === "yes" || s === "no") {
        boolCount++;
      } else if (/^\d+(\.\d+)?$/.test(s)) {
        numCount++;
      } else if (isLikelyDate(s)) {
        dateCount++;
      }
    }
  }

  const threshold = values.length * 0.8;
  if (numCount >= threshold) return "number";
  if (boolCount >= threshold) return "boolean";
  if (dateCount >= threshold) return "date";
  return "string";
}

function isLikelyDate(s: string): boolean {
  // Common date patterns
  if (!/\d{2,4}[-/]\d{1,2}[-/]\d{1,4}/.test(s) && !/^\d{4}-\d{2}/.test(s)) {
    return false;
  }
  const ts = Date.parse(s);
  if (isNaN(ts)) return false;
  const year = new Date(ts).getFullYear();
  return year >= 1900 && year <= 2100;
}

/** Returns a representative sample: first 100 + random 100 (deduplicated). */
export function getSampleRows(
  rows: Record<string, unknown>[],
  count = 200,
): Record<string, unknown>[] {
  if (rows.length <= count) return rows;

  const half = Math.floor(count / 2);
  const first = rows.slice(0, half);

  // Random sample from the rest
  const rest = rows.slice(half);
  const randomIndices = new Set<number>();
  while (randomIndices.size < Math.min(half, rest.length)) {
    randomIndices.add(Math.floor(Math.random() * rest.length));
  }
  const random = [...randomIndices].map((i) => rest[i]);

  return [...first, ...random];
}

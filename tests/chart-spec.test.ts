import { describe, it, expect } from "vitest";
import { prepareChartData, getGroupKeys } from "@/lib/chart-spec";
import type { ChartSpec } from "@/types";

const sampleRows = [
  { category: "A", revenue: 100, region: "North" },
  { category: "A", revenue: 200, region: "South" },
  { category: "B", revenue: 150, region: "North" },
  { category: "B", revenue: 50, region: "South" },
  { category: "C", revenue: 300, region: "North" },
];

describe("prepareChartData — bar", () => {
  it("aggregates yColumn by xColumn", () => {
    const spec: ChartSpec = {
      type: "bar",
      title: "Test",
      xColumn: "category",
      yColumn: "revenue",
    };
    const result = prepareChartData(spec, sampleRows);
    expect(result).toHaveLength(3);
    expect(result.find((d) => d.name === "A")).toHaveProperty("revenue", 300);
    expect(result.find((d) => d.name === "C")).toHaveProperty("revenue", 300);
  });

  it("handles groupBy", () => {
    const spec: ChartSpec = {
      type: "bar",
      title: "Test",
      xColumn: "category",
      yColumn: "revenue",
      groupBy: "region",
    };
    const result = prepareChartData(spec, sampleRows);
    const a = result.find((d) => d.name === "A")!;
    expect(a["North"]).toBe(100);
    expect(a["South"]).toBe(200);
  });
});

describe("prepareChartData — pie", () => {
  it("aggregates into slices", () => {
    const spec: ChartSpec = {
      type: "pie",
      title: "Test",
      xColumn: "category",
      yColumn: "revenue",
    };
    const result = prepareChartData(spec, sampleRows);
    expect(result).toHaveLength(3);
    // Both A and C have 300, so check that top values are correct
    expect(result[0].value).toBe(300);
    expect(result[2].value).toBe(200);
  });
});

describe("prepareChartData — scatter", () => {
  it("extracts x/y pairs", () => {
    const rows = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: "bad", y: 5 },
    ];
    const spec: ChartSpec = {
      type: "scatter",
      title: "Test",
      xColumn: "x",
      yColumn: "y",
    };
    const result = prepareChartData(spec, rows);
    // "bad" is NaN, filtered out
    expect(result).toHaveLength(2);
  });
});

describe("getGroupKeys", () => {
  it("returns yColumn for ungrouped data", () => {
    const data = [{ name: "A", revenue: 100 }];
    expect(getGroupKeys(data, "revenue")).toEqual(["revenue"]);
  });

  it("returns group keys for grouped data", () => {
    const data = [{ name: "A", North: 100, South: 200 }];
    expect(getGroupKeys(data, "revenue")).toEqual(["North", "South"]);
  });
});

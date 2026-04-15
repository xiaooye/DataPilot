import { describe, it, expect } from "vitest";
import { median, mean, formatBytes, formatNumber, truncate } from "@/lib/data-utils";

describe("median", () => {
  it("returns 0 for empty array", () => {
    expect(median([])).toBe(0);
  });

  it("returns the middle value for odd-length array", () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it("returns the average of two middle values for even-length array", () => {
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });

  it("handles single element", () => {
    expect(median([5])).toBe(5);
  });
});

describe("mean", () => {
  it("returns 0 for empty array", () => {
    expect(mean([])).toBe(0);
  });

  it("returns correct mean", () => {
    expect(mean([2, 4, 6])).toBe(4);
  });
});

describe("formatBytes", () => {
  it("formats 0 bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats bytes", () => {
    expect(formatBytes(512)).toBe("512 B");
  });

  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
  });

  it("formats megabytes", () => {
    expect(formatBytes(1048576)).toBe("1.0 MB");
  });
});

describe("formatNumber", () => {
  it("formats numbers with commas", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1234567)).toBe("1,234,567");
  });
});

describe("truncate", () => {
  it("returns string unchanged if short enough", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates with ellipsis", () => {
    expect(truncate("hello world", 6)).toBe("hello\u2026");
  });
});

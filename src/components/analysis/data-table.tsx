"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { ColumnMeta } from "@/types";
import { truncate } from "@/lib/data-utils";

const PREVIEW_ROWS = 20;

export function DataTable({
  rows,
  columns,
}: {
  rows: Record<string, unknown>[];
  columns: ColumnMeta[];
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = rows.slice(0, PREVIEW_ROWS);

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="mb-2 gap-1 text-sm"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        Data Preview ({Math.min(PREVIEW_ROWS, rows.length)} of {rows.length}{" "}
        rows)
      </Button>

      {expanded && (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.name}
                    className="whitespace-nowrap text-xs"
                  >
                    <span className="mr-1 font-mono text-muted-foreground">
                      {col.type === "number"
                        ? "#"
                        : col.type === "date"
                          ? "\u{1F4C5}"
                          : "Aa"}
                    </span>
                    {col.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.name}
                      className={`whitespace-nowrap text-xs ${
                        col.type === "number" || col.type === "date"
                          ? "font-mono"
                          : ""
                      }`}
                    >
                      {row[col.name] != null
                        ? truncate(String(row[col.name]), 40)
                        : "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

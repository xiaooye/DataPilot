"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Table2 } from "lucide-react";
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
    <div className="card-accent rounded-xl border bg-card">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between rounded-none px-5 py-4 text-sm"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="flex items-center gap-2">
          <Table2 className="h-4 w-4 text-muted-foreground" />
          Data Preview
          <span className="text-muted-foreground">
            ({Math.min(PREVIEW_ROWS, rows.length)} of {rows.length} rows)
          </span>
        </span>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      {expanded && (
        <div className="overflow-x-auto border-t">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.map((col) => (
                  <TableHead
                    key={col.name}
                    className="whitespace-nowrap text-xs"
                  >
                    <span className="mr-1.5 font-mono text-xs text-muted-foreground/60">
                      {col.type === "number"
                        ? "#"
                        : col.type === "date"
                          ? "D"
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
                          ? "font-mono tabular-nums"
                          : ""
                      }`}
                    >
                      {row[col.name] != null
                        ? truncate(String(row[col.name]), 40)
                        : (<span className="text-muted-foreground/40">&mdash;</span>)}
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

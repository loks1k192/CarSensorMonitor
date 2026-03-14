"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pages, total, onPageChange }: PaginationProps) {
  if (pages <= 1) return null;

  const getVisiblePages = (): number[] => {
    const visible: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);
    for (let i = start; i <= end; i++) visible.push(i);
    return visible;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-600">
        {total} cars total
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getVisiblePages()[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100"
            >
              1
            </button>
            {getVisiblePages()[0] > 2 && (
              <span className="px-1 text-gray-400">...</span>
            )}
          </>
        )}

        {getVisiblePages().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-primary-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {p}
          </button>
        ))}

        {getVisiblePages()[getVisiblePages().length - 1] < pages && (
          <>
            {getVisiblePages()[getVisiblePages().length - 1] < pages - 1 && (
              <span className="px-1 text-gray-400">...</span>
            )}
            <button
              onClick={() => onPageChange(pages)}
              className="px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100"
            >
              {pages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

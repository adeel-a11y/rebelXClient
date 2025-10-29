// src/components/activities/PaginationBar.jsx
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function PgBtn({ active, disabled, children, onClick }) {
  const base =
    "inline-flex items-center justify-center h-8 min-w-[2rem] rounded-full border text-sm transition";
  const classes = disabled
    ? "cursor-not-allowed opacity-50 bg-white border-slate-200 text-slate-400"
    : active
    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";

  return (
    <button
      className={`${base} ${classes} px-2`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

function makePageList(current, total) {
  if (total <= 5)
    return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5];
  if (current >= total - 2)
    return [total - 4, total - 3, total - 2, total - 1, total];
  return [current - 2, current - 1, current + 1, current + 2];
}

export default function PaginationBar({
  total = 0,
  pageSize = 20,
  currentPage = 1,
  onChangePage,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = makePageList(currentPage, totalPages);

  const start =
    total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 w-[70vh] mx-auto bg-white/95 backdrop-blur-[1px] border-t border-slate-200 rounded-[20px] shadow-[0_-4px_12px_rgba(2,6,23,0.04)]">
      <div className="h-12 grid grid-cols-3 items-center gap-2 px-3">
        <div className="text-sm text-slate-600">
          <span className="font-semibold">{start}</span>–
          <span className="font-semibold">{end}</span>
          <span className="mx-1">of</span>
          <span className="font-semibold">{total}</span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <PgBtn
            disabled={currentPage <= 1}
            onClick={() => onChangePage(currentPage - 1)}
          >
            <FaArrowLeft />
          </PgBtn>

          {pages[0] > 1 && (
            <>
              <PgBtn onClick={() => onChangePage(1)}>1</PgBtn>
              {pages[0] > 2 && (
                <span className="px-1 text-slate-400">…</span>
              )}
            </>
          )}

          {pages.map((p) => (
            <PgBtn
              key={p}
              active={p === currentPage}
              onClick={() => onChangePage(p)}
            >
              {p}
            </PgBtn>
          ))}

          {pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && (
                <span className="px-1 text-slate-400">…</span>
              )}
              <PgBtn onClick={() => onChangePage(totalPages)}>
                {totalPages}
              </PgBtn>
            </>
          )}

          <PgBtn
            disabled={currentPage >= totalPages}
            onClick={() => onChangePage(currentPage + 1)}
          >
            <FaArrowRight />
          </PgBtn>
        </div>

        <div className="text-right text-sm text-slate-700">
          Page:{" "}
          <span className="font-semibold">{currentPage}</span>
        </div>
      </div>
    </div>
  );
}

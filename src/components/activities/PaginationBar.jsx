// src/components/activities/PaginationBar.jsx
import React, { useState, useEffect } from "react";
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
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5];
  if (current >= total - 2)
    return [total - 4, total - 3, total - 2, total - 1, total];
  return [current - 2, current - 1, current + 1, current + 2];
}

function PaginationBar({
  total = 0,
  pageSize = 100,
  currentPage = 1,
  onChangePage,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = makePageList(currentPage, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  const [pageInput, setPageInput] = useState(currentPage);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handlePageInput = (event) => {
    const inputPage = Number(event.target.value);
    if (inputPage >= 1 && inputPage <= totalPages) {
      setPageInput(inputPage);
      // Clear previous debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      // Set a new timer for 1 second
      const newTimer = setTimeout(() => {
        onChangePage(inputPage);
      }, 1000);
      setDebounceTimer(newTimer);
    }
  };

  return (
    <div className="fixed bottom-20 lg:left-[60%] xl:left-[56%] -translate-x-1/2 z-10 w-[800px] mx-auto rounded-[5px] bg-white/95 backdrop-blur-[1px] px-2 border-t border-slate-200 shadow-[0_-4px_12px_rgba(2,6,23,0.04)]">
      <div className="h-14 grid grid-cols-3 items-center gap-2 px-3">
        {/* Pagination Info */}
        <div className="text-sm text-slate-600">
          <span className="font-semibold">{start}</span>–<span className="font-semibold">{end}</span>
          <span className="mx-1">of</span>
          <span className="font-semibold">{total}</span>
        </div>

        {/* Pagination Buttons */}
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
              {pages[0] > 2 && <span className="px-1 text-slate-400">…</span>}
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

        {/* Page Input */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-sm text-slate-600">Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={pageInput}
            onChange={handlePageInput}
            className="w-16 p-2 text-sm text-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}

export default PaginationBar;
import { useState, useRef, useEffect } from "react";

function SearchableSelect({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setQuery(""); // Clear query when closing
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on the query input (case-insensitive)
  const filtered = query.trim()
    ? options.filter((o) =>
        o.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  const handleSelect = (option) => {
    onChange?.({ target: { value: option } });
    setOpen(false); // Close dropdown after selection
    setQuery(""); // Clear query after selection
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleToggleDropdown = () => {
    setOpen((prevState) => !prevState); // Toggle open state
  };

  return (
    <div className="flex flex-col gap-1 relative" ref={wrapperRef}>
      {label && (
        <span className="text-xs font-medium text-slate-600">
          {label}
        </span>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={handleToggleDropdown}
        className="flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {value || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
          {/* Search input */}
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              value={query}
              onChange={handleSearchChange}
              placeholder="Search…"
              className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-slate-300"
            />
          </div>

          {/* Options list */}
          <div className="max-h-52 overflow-y-auto py-1 text-sm">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-slate-400">No results</div>
            )}

            {filtered.map((opt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-3 py-2 hover:bg-indigo-50 ${
                  opt === value ? "bg-indigo-50 text-indigo-600" : ""
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;

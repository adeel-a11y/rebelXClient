import { useUI } from "../../store/ui";
import { useToolbarStore } from "../../store/toolbar";

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 20L17 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Topbar() {
  const { collapsed, toggleSidebar } = useUI();
  const { cfg } = useToolbarStore();

  return (
    <header className="topbar">
      <div className="left">
        <button
          className="chev"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
        >
          {collapsed ? "»" : "«"}
        </button>
        <div>
          <div className="title">{cfg?.title || "Dashboard"}</div>
          {cfg?.subtitle && <div className="crumb">{cfg.subtitle}</div>}
        </div>
      </div>

      <div className="toolbar">
        {cfg?.searchPlaceholder && (
          <div className="search">
            <SearchIcon />
            <input
              placeholder={cfg.searchPlaceholder}
              onChange={(e) => cfg?.onSearch?.(e.target.value)}
            />
          </div>
        )}

        {(cfg?.actions || []).map((a, i) => (
          <button
            key={i}
            className={`btn ${a.variant || ""}`}
            onClick={a.onClick}
          >
            {a.label}
          </button>
        ))}
      </div>
    </header>
  );
}

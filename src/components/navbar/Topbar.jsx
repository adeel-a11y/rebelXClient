// src/components/navbar/Topbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useUI } from "../../store/ui";
import { useToolbarStore } from "../../store/toolbar";
import { FiFilter } from "react-icons/fi";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

function SearchIcon() { /* ...same as yours... */ }

export default function Topbar() {
  const { collapsed, toggleSidebar } = useUI();
  const { cfg } = useToolbarStore();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="left">
        {/* <button className="chev" aria-label="Toggle sidebar" onClick={toggleSidebar} type="button">
          {collapsed ? (
            <MdKeyboardDoubleArrowRight size={20} />
          ) : (
            <MdKeyboardDoubleArrowLeft size={20} />
          )}
        </button> */}
        <div className="px-3">
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

        {(cfg?.actions || []).map((a, i) => {
          const classes = `btn ${a.variant || ""} ${
            a.label === "Filter" ? "flex items-center justify-between" : ""
          }`;

          // 1) If "to" prop is present → Link
          if (a.to) {
            return (
              <Link key={i} to={a.to} className={classes}>
                {a.label === "Filter" && <FiFilter className="me-2" />} {a.label}
              </Link>
            );
          }

          // 2) Else normal button onClick (with type="button")
          return (
            <button
              key={i}
              type="button"
              className={`${classes} flex items-center`}
              onClick={(e) => {
                if (a.onClick) a.onClick(e);
                // optional: if some actions pass navigate string dynamically
                if (typeof a.href === "string") navigate(a.href);
              }}
            >
              {a.label === "Filter" && <FiFilter className="me-2" />} {a.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}

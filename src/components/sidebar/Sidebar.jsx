import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUI } from "../../store/ui";

/* Icons */
import { IoHome } from "react-icons/io5";
import {
  FaUserTie,
  FaUsers,
  FaStar,
  FaWarehouse,
  FaShoppingCart,
  FaClock,
  FaFlask,
  FaChartBar,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { GiFactory } from "react-icons/gi";
import { FiActivity } from "react-icons/fi";

/* --- items: mark unfinished ones as disabled: true --- */
const baseItems = [
  { to: "/", label: "Dashboard", icon: <IoHome /> },
  { to: "/clients", label: "Clients", icon: <FaUserTie /> },
  { to: "/users", label: "Users", icon: <FaUsers /> },
  { to: "/activities", label: "Activities", icon: <FiActivity /> },

  // disabled for now (no click, no active)
  {
    to: "/inventory",
    label: "Inventory",
    icon: <FaWarehouse />,
    disabled: true,
  },
  {
    to: "/manufacturing",
    label: "Manufacturing",
    icon: <GiFactory />,
    disabled: true,
  },
  { to: "/sales", label: "Sales", icon: <FaShoppingCart />, disabled: true },
  { to: "/time-clock", label: "Time Clock", icon: <FaClock />, disabled: true },
  { to: "/labs", label: "Labs", icon: <FaFlask />, disabled: true },
];

const reportsItem = {
  label: "Reports",
  icon: <FaChartBar />,
  children: [
    { to: "/reports/overview", label: "Overview" },
    { to: "/reports/clients", label: "Client Reports" },
    { to: "/reports/sales", label: "Sales Reports" },
    { to: "/reports/activities", label: "Activity Reports" },
  ],
};

/* ---------- helper: one item that can be disabled ---------- */
function NavItem({ to, icon, label, disabled, collapsed }) {
  if (disabled) {
    return (
      <div
        className="navlink disabled"
        role="button"
        aria-disabled="true"
        onClick={(e) => e.preventDefault()} // no action
      >
        <span className="icon" aria-hidden>
          {icon}
        </span>
        <span className="label">{collapsed ? "" : label}</span>
      </div>
    );
  }
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "active" : undefined)}
      end
    >
      <span className="icon" aria-hidden>
        {icon}
      </span>
      <span className="label">{collapsed ? "" : label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { collapsed } = useUI();
  const location = useLocation();
  const [reportsOpen, setReportsOpen] = useState(false);

  useEffect(() => {
    setReportsOpen(location.pathname.startsWith("/reports"));
  }, [location.pathname]);

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="logo text-xl">
        <span>
          <FaStar color="#ffd800" />
        </span>
        <span className="label">RebelX</span>
      </div>

      {/* Nav */}
      <nav className="nav">
        {baseItems.map((x) => (
          <NavItem
            key={x.label}
            to={x.to}
            icon={x.icon}
            label={x.label}
            disabled={x.disabled}
            collapsed={collapsed}
          />
        ))}

        {/* Reports dropdown: parent never navigates (button), no active class */}
        <div className={`nav-group ${reportsOpen ? "open" : ""}`}>
          <button
            type="button"
            className={`flex items-center justify-between nav-toggle ms-4 mt-2 ${
              location.pathname.startsWith("/reports") ? "active" : ""
            }`}
            onClick={() => setReportsOpen((v) => !v)}
            aria-expanded={reportsOpen}
            aria-controls="reports-submenu"
          >
            <div className="flex items-center">
              <span className="icon" aria-hidden>
                {reportsItem.icon}
              </span>
              <span className="label ms-2">
                {collapsed ? "" : reportsItem.label}
              </span>
            </div>
            {!collapsed && (
              <div className="chev ms-auto flex justify-end" aria-hidden>
                {reportsOpen ? <FaChevronDown /> : <FaChevronRight />}
              </div>
            )}
          </button>

          <div
            id="reports-submenu"
            className="submenu"
            style={{
              height: reportsOpen && !collapsed ? "auto" : 0,
              overflow: "hidden",
            }}
          >
            {reportsItem.children.map((c) => (
              <NavLink
                key={c.to}
                to={c.to}
                className={({ isActive }) =>
                  "submenu-link" + (isActive ? " active" : "")
                }
              >
                <span className="dot" aria-hidden />
                <span className="label">{c.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Profile */}
      <div className="profile">
        <div className="avatar">AU</div>
        <div className="who">
          <strong>Admin User</strong>
          <small>Administrator</small>
        </div>
      </div>
    </aside>
  );
}

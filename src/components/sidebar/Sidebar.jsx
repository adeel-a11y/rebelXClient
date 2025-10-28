import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUI } from "../../store/ui";

/* Icons */
import { IoHome } from "react-icons/io5";
import {
  FaUserTie,
  FaUsers,
  FaWarehouse,
  FaShoppingCart,
  FaClock,
  FaFlask,
  FaChartBar,
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { GiFactory } from "react-icons/gi";
import { FiActivity } from "react-icons/fi";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { TbSettings } from "react-icons/tb";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { MdMenuOpen } from "react-icons/md";

/* --- items --- */
const dashboardItems = [
  { to: "/", label: "Dashboard", icon: <IoHome /> },
  { to: "/clients", label: "Clients", icon: <FaUserTie /> },
  { to: "/users", label: "Users", icon: <FaUsers /> },
  { to: "/activities", label: "Activities", icon: <FiActivity /> },
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

/* ------------- small helpers ------------- */
function Item({ to, icon, label, disabled, collapsed }) {
  const inner = (
    <>
      <span className="icon" aria-hidden>
        {icon}
      </span>
      <span className="label text-sm font-medium">
        {collapsed ? "" : label}
      </span>
    </>
  );
  if (disabled) {
    return (
      <div
        className="navlink text-sm font-medium"
        role="button"
        aria-disabled="true"
        onClick={(e) => e.preventDefault()}
      >
        {inner}
      </div>
    );
  }
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => "navlink" + (isActive ? " active" : "")}
    >
      {inner}
    </NavLink>
  );
}

export default function Sidebar() {
  const { collapsed, toggleSidebar } = useUI(); // ensure your store exposes toggleSidebar()
  const location = useLocation();
  const [reportsOpen, setReportsOpen] = useState(false);

  useEffect(() => {
    setReportsOpen(location.pathname.startsWith("/reports"));
  }, [location.pathname]);

  return (
    <aside className="sidebar" data-collapsed={collapsed ? "true" : "false"}>
      {/* floating collapse button on edge */}
      <button
        type="button"
        className="collapse-btn focus:outline-none"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={toggleSidebar}
      >
        {collapsed ? (
          <MdMenuOpen size={20} />
        ) : (
          <MdMenuOpen size={20} />
        )}
      </button>

      {/* sky header */}
      <div className="sky">
        <div className="brand flex items-center">
          <span className="dot" />
          <span className="brand-text">RebleX V3.</span>
        </div>
      </div>

      {/* sections */}
      <nav className="nav">
        {!collapsed && <div className="section-title">DASHBOARD</div>}
        {dashboardItems.slice(0, 4).map((x) => (
          <Item key={x.label} {...x} collapsed={collapsed} />
        ))}

        {/* AI Automation with “New” pill (visual only) */}
        {/* <div className="navline">
          <Item to="/ai-automation" label="AI Automation" icon={<TbSettings />} collapsed={collapsed} disabled />
          {!collapsed && <span className="pill">New</span>}
        </div> */}

        {dashboardItems.slice(4).map((x) => (
          <Item key={x.label} {...x} collapsed={collapsed} />
        ))}

        {/* Reports dropdown */}
        <div className={`nav-group ${reportsOpen ? "open" : ""}`}>
          <button
            type="button"
            className={
              "nav-toggle" +
              (location.pathname.startsWith("/reports") ? " active" : "")
            }
            onClick={() => setReportsOpen((v) => !v)}
            aria-expanded={reportsOpen}
            aria-controls="reports-submenu"
          >
            <span className="icon">{reportsItem.icon}</span>
            <span className="label text-sm font-medium">
              {collapsed ? "" : reportsItem.label}
            </span>
            {!collapsed && (
              <span className="chev">
                {reportsOpen ? (
                  <FaChevronDown size={12} />
                ) : (
                  <FaChevronRight size={12} />
                )}
              </span>
            )}
          </button>

          <div
            id="reports-submenu"
            className="submenu"
            style={{ height: reportsOpen && !collapsed ? "auto" : 0 }}
          >
            {reportsItem.children.map((c) => (
              <NavLink
                key={c.to}
                to={c.to}
                className={({ isActive }) =>
                  "submenu-link" + (isActive ? " active" : "")
                }
              >
                <span className="dot" />
                <span className="label text-sm font-medium">{c.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* {!collapsed && <div className="section-title mt">SETTINGS</div>} */}
        {/* sample settings (disabled visual like the screenshot) */}
        {/* <Item to="/settings/campaign" label="Campaign Settings" icon={<TbSettings />} disabled collapsed={collapsed} />
        <Item to="/settings/integrations" label="Integrations" icon={<TbSettings />} disabled collapsed={collapsed} />
        <Item to="/settings/domains" label="Domains" icon={<TbSettings />} disabled collapsed={collapsed} />
        <Item to="/settings/subscription" label="Subscription" icon={<TbSettings />} disabled collapsed={collapsed} />
        <Item to="/settings/api-keys" label="API Keys" icon={<TbSettings />} disabled collapsed={collapsed} /> */}
      </nav>

      {/* upgrade card */}
      <div className="upgrade">
        {!collapsed ? (
          <>
            <div className="flex items-center">
              <img
                src="https://media.istockphoto.com/id/1500308602/photo/happy-black-man-mature-or-portrait-in-finance-office-about-us-company-profile-picture-or-ceo.jpg?s=612x612&w=0&k=20&c=3BWt_eT7QaaiGx4zI_K63pnntIp5Cv1qW8Pw-_bSlm8="
                alt=""
                className="w-12 h-12 object-cover object-center rounded-full"
              />
              <div className="ms-2">
                <h1 className="text-sm text-[#222] font-medium">Leo Ray</h1>
                <h5 className="text-xs">Administrator</h5>
              </div>
            </div>
          </>
        ) : (
          <div className="tiny-pro">PRO</div>
        )}
      </div>
    </aside>
  );
}

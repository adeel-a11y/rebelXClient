import { NavLink } from "react-router-dom";
import { useUI } from "../../store/ui";

const items = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/clients", label: "Clients", icon: "👥" },
  { to: "/users", label: "Users", icon: "🙍" },
  { to: "/activities", label: "Activities", icon: "📊" },
];

export default function Sidebar() {
  const { collapsed } = useUI();
  return (
    <aside className="sidebar">
      <div className="logo">
        <span
          style={{
            display: "inline-grid",
            placeItems: "center",
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "#0ea5e9",
            color: "#00112a",
            fontWeight: 900,
          }}
        >
          ★
        </span>
        <span className="label">RebelX V3</span>
        <span className="badge" style={{ marginLeft: "auto" }}>
          LIVE
        </span>
      </div>

      <nav className="nav">
        {items.map((x) => (
          <NavLink
            key={x.to}
            to={x.to}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <span className="icon" aria-hidden>
              {x.icon}
            </span>
            <span className="label">{collapsed ? "" : x.label}</span>
          </NavLink>
        ))}
      </nav>
      
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

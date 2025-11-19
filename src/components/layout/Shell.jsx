import Sidebar from "../sidebar/Sidebar";
import Topbar from "../navbar/Topbar";
import AppFooter from "../footer/AppFooter";
import { useUI } from "../../store/ui";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Shell() {
  const { collapsed } = useUI();
  const location = useLocation();

  return (
    <div className={`app-shell ${collapsed ? "is-collapsed" : ""}`}>
      <Sidebar />
      <Topbar />
      <main className="main">
        <Outlet />
      </main>
      {location.pathname.includes("user-details") ? null : <AppFooter />}
    </div>
  );
}

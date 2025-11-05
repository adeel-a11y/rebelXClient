// src/components/layout/AppFooter.jsx (or where this file lives)
import ClientSummaryBar from "../summary/ClientSummaryBar";
import { useClientsSummary } from "../../hooks/useClients";
import { useLocation } from "react-router-dom";
import UsersSummaryBar from "../summary/UsersSummaryBar";
import ActivitiesSummaryBar from "../summary/ActivitySummaryBar"; // 👈 add
import OrdersSummaryBar from "../summary/OrdersSummaryBar"; // 👈 add

export default function AppFooter() {
  const location = useLocation();
  const { data: clientSummary, isLoading: clientSummaryLoading } =
    useClientsSummary();

  // optional: pick datePreset from URL (?datePreset=today|this_month|this_year|prev_year)
  const sp = new URLSearchParams(location.search);
  const datePreset = sp.get("datePreset") || null; // activities-only (ignored elsewhere)
  const q = sp.get("q") || ""; // optional search, if you ever add it to URL

  // hide footer on details/new pages
  const hideOnDetails =
    location.pathname.includes("/user-details") ||
    location.pathname.includes("/client-details") ||
    location.pathname.includes("/activity-details") || // 👈 add
    location.pathname.includes("/clients/new") ||
    location.pathname.includes("/activities/new"); // 👈 add

  return (
    <footer className={`app-footer ${hideOnDetails ? "hidden" : ""}`}>
      <div className="app-footer__scroll">
        {location.pathname === "/users" && (
          <UsersSummaryBar className="footer-row" />
        )}

        {location.pathname === "/clients" && (
          <ClientSummaryBar
            className="footer-row"
            data={clientSummary}
            loading={clientSummaryLoading}
          />
        )}

        {location.pathname === "/activities" && (
          <ActivitiesSummaryBar
            className="footer-row"
            // props optional: if you’re not using URL params, you can omit these
            q={q}
            datePreset={datePreset}
          />
        )}

        {location.pathname.includes("client-activities") && (
          <ActivitiesSummaryBar
            className="footer-row"
          />
        )}

        {location.pathname.includes("orders") && (
          <OrdersSummaryBar
            className="footer-row"
            // props optional: if you’re not using URL params, you can omit these
            // q={q}
            // datePreset={datePreset}
          />
        )}

        {location.pathname.includes("client-orders") && (
          <OrdersSummaryBar
            className="footer-row"
            // props optional: if you’re not using URL params, you can omit these
            // q={q}
            // datePreset={datePreset}
          />
        )}
      </div>
    </footer>
  );
}

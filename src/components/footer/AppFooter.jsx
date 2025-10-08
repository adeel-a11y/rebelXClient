import ClientSummaryBar from "../summary/ClientSummaryBar";
import { useClientsSummary } from "../../hooks/useClients";
import { useLocation } from "react-router-dom";
import UsersSummaryBar from "../summary/UsersSummaryBar";

export default function AppFooter() {
  const location = useLocation();
  const { data: sum, isLoading: sumLoading } = useClientsSummary();

  const hideOnDetails =
    location.pathname.includes("/user-details") ||
    location.pathname.includes("/client-details") ||
    location.pathname.includes("/clients/new") ;

  return (
    <footer className={`app-footer ${hideOnDetails ? "hidden" : ""}`}>
      <div className="app-footer__scroll">
        {location.pathname === "/users" && (
          <UsersSummaryBar className="footer-row" />
        )}
        {location.pathname === "/clients" && (
          <ClientSummaryBar className="footer-row" data={sum} loading={sumLoading} />
        )}
      </div>
    </footer>
  );
}
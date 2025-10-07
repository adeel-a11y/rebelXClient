import ClientSummaryBar from "../summary/ClientSummaryBar";
import { useClientsSummary } from "../../hooks/useClients";
import { useLocation } from "react-router-dom";
import UsersSummaryBar from "../summary/UsersSummaryBar";

export default function AppFooter() {

  const location = useLocation();

  const { data: sum, isLoading: sumLoading } = useClientsSummary();

  return (
    <footer className={`app-footer ${location.pathname === "/users" ? "lg:h-[160px] xl:h-[140px] 2xl:h-[96px]" : location.pathname.includes("/user-details") || location.pathname.includes("/client-details") ? "hidden" : ""}`}>
      {location.pathname === "/users" && <UsersSummaryBar />}
      {location.pathname === "/clients" && <ClientSummaryBar data={sum} loading={sumLoading} />}
    </footer>
  );
}

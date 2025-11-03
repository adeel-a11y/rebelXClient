// src/components/details/client-details/ActivityPanel/ActivityPanel.jsx
import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import StatsTabsPanel from "./StatsTabsPanel";
import { useDebouncedValue } from "../../../utils/useDebounceValue";

// data hooks
import { useActivitiesByClient } from "../../../hooks/useClients";
import { useClientOrdersStats } from "../../../hooks/useLookups";

export default function ActivityPanel() {
  const { id, externalId } = useParams(); // make sure your route provides these
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 400);

  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  // Tabs: "activities" | "orders"
  const [value, setValue] = useState("activities");

  // Activities (existing)
  const {
    data: clientCounts,
    isFetching: clientCountsFetching,
  } = useActivitiesByClient(id, page, 10, debouncedQ);

  // Orders Stats – fetch ONLY when Orders tab is active
  const {
    data: clientOrdersStatsResp,
    isFetching: ordersStatsFetching,
  } = useClientOrdersStats(externalId, value === "orders" && !!externalId);
  const clientOrdersStats = clientOrdersStatsResp?.data;

  return (
    <>
      <HeaderBar
        activeTab={value}
        counts={clientCounts?.counts}            // for Activities
        orderStats={clientOrdersStats}           // for Orders
        q={q}
        onChange={setQ}
        isFetchingActivities={clientCountsFetching}
        isFetchingOrders={ordersStatsFetching}
      />

      <StatsTabsPanel value={value} setValue={setValue} />
      {/* If later you re-enable the list: <ActivityList page={page} setPage={setPage} q={debouncedQ} /> */}
    </>
  );
}

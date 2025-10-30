// src/components/details/client-details/ActivityPanel/ActivityPanel.jsx
import * as React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useActivitiesByClient } from "../../../hooks/useClients"; // adjust path
import { useDebouncedValue } from "../../../utils/useDebounceValue";
import HeaderBar from "./HeaderBar";
import ActivityList from "./ActivityList";
import StatsTabsPanel from "./StatsTabsPanel";

export default function ActivityPanel() {
  const { id } = useParams();
  const [q, setQ] = React.useState("");
  const debouncedQ = useDebouncedValue(q, 400);

  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  const { data, isFetching } = useActivitiesByClient(id, page, 50, debouncedQ);

  return (
    <>
      <HeaderBar
        counts={data?.counts}
        q={q}
        onChange={setQ}
        isFetching={isFetching}
      />
      <StatsTabsPanel />
      {/* <ActivityList page={page} setPage={setPage} q={debouncedQ} /> */}
    </>
  );
}

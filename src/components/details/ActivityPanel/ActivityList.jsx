// src/components/details/client-details/ActivityPanel/ActivityList.jsx
import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useActivitiesByClient } from "../../../hooks/useClients"; // adjust path
import ActivityRow from "./ActivityRow";
import PaginationBar from "./PaginationBar";

export default function ActivityList({ page, setPage, q }) {
  const { id } = useParams();
  const perPage = 50;

  const { data, isLoading, isFetching } = useActivitiesByClient(
    id,
    page,
    perPage,
    q
  );

  const rows = data?.data ?? [];
  const total = Number(data?.total || 0);
  const totalPages = Number(
    data?.totalPages || Math.max(Math.ceil(total / perPage), 1)
  );

  return (
    <Card
      sx={{
        mt: 1.5,
        display: "flex",
        flexDirection: "column",
        maxHeight: "70vh",
       
        overflowY: "scroll",
      }}
    >
      <CardContent
        sx={{ p: 0, display: "flex", flexDirection: "column", flex: 1 }}
      >
        <Box sx={{ px: 2.25, py: 1.75, borderBottom: "1px solid #eef1f4" }}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Typography fontWeight={700}>Activities</Typography>
            {isFetching && (
              <Typography variant="caption" color="text.secondary">
                updating…
              </Typography>
            )}
          </Stack>
        </Box>

        {/* header row */}
        <Stack
          direction="row"
          sx={{
            py: 1,
            px: 2.25,
            color: "#6b7280",
            fontSize: 12,
            borderBottom: "1px solid #f1f5f9",
          }}
          spacing={2}
        >
          <Box sx={{ width: "5%" }}>Type</Box>
          <Box sx={{ flex: 1, width: "70%" }}>Description</Box>
          <Box sx={{ width: "10%" }}>Date</Box>
          <Box sx={{ width: "10%" }}>User</Box>
          <Box sx={{ width: "5%", textAlign: "center" }}>Manage</Box>
        </Stack>

        {/* rows */}
        <Box sx={{ px: 2.25, overflowY: "auto", flex: 1 }}>
          {isLoading ? (
            <Box sx={{ p: 2, color: "text.secondary" }}>
              Loading activities…
            </Box>
          ) : rows.length === 0 ? (
            <Box sx={{ p: 2, color: "text.secondary" }}>
              No activities found.
            </Box>
          ) : (
            rows.map((row, idx) => (
              <React.Fragment key={row._id || `${row.trackingId}-${idx}`}>
                <ActivityRow row={row} />
                {idx < rows.length - 1 && (
                  <Divider sx={{ borderColor: "#f2f4f7" }} />
                )}
              </React.Fragment>
            ))
          )}
        </Box>

        <PaginationBar
          page={data?.page || page}
          perPage={data?.perPage || perPage}
          total={total}
          totalPages={totalPages}
          onChange={(p) => setPage(p)}
        />
      </CardContent>
    </Card>
  );
}

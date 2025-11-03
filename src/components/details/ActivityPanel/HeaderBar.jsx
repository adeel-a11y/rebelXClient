// src/components/details/client-details/ActivityPanel/HeaderBar.jsx
import { Stack, TextField, InputAdornment, Card, Typography } from "@mui/material";
import { RiSearchLine } from "react-icons/ri";

export default function HeaderBar({
  activeTab = "activities",
  counts,
  orderStats,
  q,
  onChange,
  isFetchingActivities = false,
  isFetchingOrders = false,
}) {
  return (
    <Stack spacing={1.5}>
      {/* top stat cards */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-4">
        {activeTab === "orders" ? (
          <>
            <div>
              <Card sx={{ p: 2, background: "#e5e5e5" }}>
                <Typography variant="h6" fontWeight={800}>
                  {orderStats?.totalOrders ?? 0}
                </Typography>
                <h6 className="lg:text-xs 2xl:text-base" color="text.secondary">
                  Total Orders {isFetchingOrders ? "…" : ""}
                </h6>
              </Card>
            </div>

            <div>
              <Card sx={{ p: 2, background: "#e7fbe8" }}>
                <Typography variant="h6" fontWeight={800} color="#2faa48">
                  {orderStats?.completed ?? 0}
                </Typography>
                <h6 className="lg:text-xs 2xl:text-base text-[#2faa48]">
                  Completed
                </h6>
              </Card>
            </div>

            <div>
              <Card sx={{ p: 2, background: "#fff4f5" }}>
                <Typography variant="h6" fontWeight={800} color="#f43940">
                  {orderStats?.issued ?? 0}
                </Typography>
                <h6 className="lg:text-xs 2xl:text-base text-[#f43940]">
                  Issued
                </h6>
              </Card>
            </div>

            <div>
              <Card sx={{ p: 2, background: "#e5ecf9" }}>
                <Typography variant="h6" fontWeight={800} color="#2563EB">
                  {orderStats?.others ?? 0}
                </Typography>
                <h6 className="lg:text-xs 2xl:text-base text-[#2563EB]">
                  Others
                </h6>
              </Card>
            </div>
          </>
        ) : (
          <>
            <div>
              <Card sx={{ p: 2, background: "#e5e5e5" }}>
                <Typography variant="h6" fontWeight={800}>
                  {counts?.total || 0}
                </Typography>
                <h6 className="lg:text-xs 2xl:text-base" color="text.secondary">
                  Total Activities {isFetchingActivities ? "…" : ""}
                </h6>
              </Card>
            </div>

            <div>
              <Card sx={{ p: 2, background: "#e7fbe8" }}>
                <Typography variant="h6" fontWeight={800} color="#2faa48">
                  {counts?.calls || 0}
                </Typography>
                <h6 className="lg:text-xs 2xl:text-base text-[#2faa48]">
                  Total Calls
                </h6>
              </Card>
            </div>

            <div>
              <Card sx={{ p: 2, background: "#fff4f5" }}>
                <Typography variant="h6" fontWeight={800} color="#f43940">
                  {counts?.emails || 0}
                </Typography>
                <h6 className="lg:text-xs 2xl:text-base text-[#f43940]">
                  Total Emails
                </h6>
              </Card>
            </div>

            <div>
              <Card sx={{ p: 2, background: "#e5ecf9" }}>
                <Typography variant="h6" fontWeight={800} color="#2563EB">
                  {counts?.others || 0}
                </Typography>
                <h6 className="lg:text-xs 2xl:text-base text-[#2563EB]">
                  Others
                </h6>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* search input (optional, kept as-is) */}
      <TextField
        size="small"
        placeholder="Search…"
        value={q}
        onChange={(e) => onChange?.(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <RiSearchLine />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}

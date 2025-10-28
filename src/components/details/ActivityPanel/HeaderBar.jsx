// src/components/details/client-details/ActivityPanel/HeaderBar.jsx
import { Stack, TextField, InputAdornment, Card, Typography } from "@mui/material";
import { RiSearchLine } from "react-icons/ri";

export default function HeaderBar({ counts, q, onChange, isFetching }) {
  return (
    <Stack spacing={1.5}>
      {/* <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        alignItems={{ md: "center" }}
      >
        <TextField
          placeholder="Search Activity (name, type, tracking #, etc.)"
          fullWidth
          value={q}
          onChange={(e) => onChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <RiSearchLine />
              </InputAdornment>
            ),
          }}
        />
      </Stack> */}

      <div className="grid lg:grid-cols-2 2xl:grid-cols-4">
        <div>
          <Card sx={{ p: 2, background: "#e5e5e5" }}>
            <Typography variant="h6" fontWeight={800}>
              {counts?.total || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Activities {isFetching ? "…" : ""}
            </Typography>
          </Card>
        </div>
        <div>
          <Card sx={{ p: 2, background: "#e7fbe8" }}>
            <Typography variant="h6" fontWeight={800} color="#2faa48">
              {counts?.calls || 0}
            </Typography>
            <Typography variant="body2" color="#2faa48">
              Total Calls
            </Typography>
          </Card>
        </div>
        <div>
          <Card sx={{ p: 2, background: "#fff4f5" }}>
            <Typography variant="h6" fontWeight={800} color="#f43940">
              {counts?.emails || 0}
            </Typography>
            <Typography variant="body2" color="#f43940">
              Total Emails
            </Typography>
          </Card>
        </div>
        <div>
          <Card sx={{ p: 2, background: "#e5ecf9" }}>
            <Typography variant="h6" fontWeight={800} color="#2563EB">
              {counts?.others || 0}
            </Typography>
            <Typography variant="body2" color="#2563EB">
              Others
            </Typography>
          </Card>
        </div>
      </div>
    </Stack>
  );
}

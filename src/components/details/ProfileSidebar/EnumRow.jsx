// src/components/details/client-details/ProfileSidebar/EnumRow.jsx
import { Box, Chip, Stack, Typography } from "@mui/material";

export default function EnumRow({ label, value, map, icon, iconColor }) {
  if (!value) {
    return (
      <Stack direction="row" spacing={1} sx={{ mb: 1.25 }}>
        <Stack spacing={0.25} sx={{ flex: 1 }}>
          <div className="flex space-x-2 pb-2">
            {icon ? (
              <Box
                sx={{
                  mt: "2px",
                  color: iconColor || "#6b7280",
                  fontSize: 16,
                }}
              >
                {icon}
              </Box>
            ) : null}

            <Typography
              variant="subtitle2"
              sx={{ color: "text.secondary", fontSize: ".75rem" }}
            >
              {label}
            </Typography>
          </div>
          <div className="w-full flex px-1">
            <Chip
              size="small"
              label="—"
              sx={{
                fontWeight: 600,
                borderRadius: 999,
                bgcolor: "#eef2f7",
                color: "#475569",
                border: "1px solid rgba(0,0,0,0.04)",
                width: "100%",
              }}
            />
          </div>
        </Stack>
      </Stack>
    );
  }

  const c = map[value] || { bg: "#eef2f7", fg: "#475569" };

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 1.25 }}>
      <Stack spacing={0.25} sx={{ flex: 1 }}>
        <div className="flex space-x-2 pb-2">
          {icon ? (
            <Box
              sx={{
                mt: "2px",
                color: iconColor || c.fg,
                fontSize: 16,
              }}
            >
              {icon}
            </Box>
          ) : null}

          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", fontSize: ".75rem" }}
          >
            {label}
          </Typography>
        </div>

        <div className="w-full flex px-1">
          <Chip
            size="small"
            label={value}
            sx={{
              fontWeight: 600,
              borderRadius: 999,
              bgcolor: c.bg,
              color: c.fg,
              border: "1px solid rgba(0,0,0,0.04)",
              width: "100%",
            }}
          />
        </div>
      </Stack>
    </Stack>
  );
}

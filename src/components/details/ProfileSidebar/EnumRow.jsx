// src/components/details/client-details/ProfileSidebar/EnumRow.jsx
import { Box, Chip, Stack, Typography, TextField, MenuItem } from "@mui/material";

export default function EnumRow({
  label,
  value,
  map,
  icon,
  iconColor,
  // NEW:
  editMode = false,
  onChange,              // (newVal) => void
  options,               // explicit options; defaults to Object.keys(map || {})
}) {
  const color = (map && value && map[value]) || { bg: "#eef2f7", fg: "#475569" };

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 1.25 }}>
      <Stack spacing={0.25} sx={{ flex: 1 }}>
        <div className="flex items-center gap-2 pb-2">
          {icon ? (
            <Box sx={{ mt: "2px", color: iconColor || color.fg, fontSize: 16 }}>
              {icon}
            </Box>
          ) : null}
          <Typography variant="subtitle2" sx={{ color: "text.secondary", fontSize: ".75rem" }}>
            {label}
          </Typography>
        </div>

        <div className="w-full flex px-1">
          {editMode ? (
            <TextField
              select
              size="small"
              fullWidth
              value={value || ""}
              onChange={(e) => onChange?.(e.target.value)}
            >
              {(options || Object.keys(map || {})).map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt || "—"}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Chip
              size="small"
              label={value || "—"}
              sx={{
                fontWeight: 600,
                borderRadius: 999,
                bgcolor: (value && color.bg) || "#eef2f7",
                color: (value && color.fg) || "#475569",
                border: "1px solid rgba(0,0,0,0.04)",
                width: "100%",
              }}
            />
          )}
        </div>
      </Stack>
    </Stack>
  );
}

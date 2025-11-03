// src/components/details/client-details/ProfileSidebar/EnumRow.jsx
import { Box, Chip, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import { FiEdit2 } from "react-icons/fi";

export default function EnumRow({ label, value, map, icon, iconColor, editable = false, onEdit }) {
  if (!value) {
    return (
      <Stack direction="row" spacing={1} sx={{ mb: 1.25 }}>
        <Stack spacing={0.25} sx={{ flex: 1 }}>
          <div className="flex items-center gap-2 pb-2">
            {icon ? <Box sx={{ mt: "2px", color: iconColor || "#6b7280", fontSize: 16 }}>{icon}</Box> : null}
            <Typography variant="subtitle2" sx={{ color: "text.secondary", fontSize: ".75rem" }}>{label}</Typography>
            {editable ? (
              <Tooltip title={`Edit ${label}`}>
                <IconButton size="small" onClick={onEdit} sx={{ p: 0.5, ml: "auto" }}>
                  <FiEdit2 size={14} />
                </IconButton>
              </Tooltip>
            ) : null}
          </div>
          <div className="w-full flex px-1">
            <Chip size="small" label="—" sx={{ fontWeight: 600, borderRadius: 999, bgcolor: "#eef2f7", color: "#475569", border: "1px solid rgba(0,0,0,0.04)", width: "100%" }} />
          </div>
        </Stack>
      </Stack>
    );
  }

  const c = map[value] || { bg: "#eef2f7", fg: "#475569" };

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 1.25 }}>
      <Stack spacing={0.25} sx={{ flex: 1 }}>
        <div className="flex items-center gap-2 pb-2">
          {icon ? <Box sx={{ mt: "2px", color: iconColor || c.fg, fontSize: 16 }}>{icon}</Box> : null}
          <Typography variant="subtitle2" sx={{ color: "text.secondary", fontSize: ".75rem" }}>{label}</Typography>
          {editable ? (
            <Tooltip title={`Edit ${label}`}>
              <IconButton size="small" onClick={onEdit} sx={{ p: 0.5, ml: "auto" }}>
                <FiEdit2 size={14} />
              </IconButton>
            </Tooltip>
          ) : null}
        </div>

        <div className="w-full flex px-1">
          <Chip
            size="small"
            label={value}
            sx={{
              fontWeight: 600, borderRadius: 999,
              bgcolor: c.bg, color: c.fg, border: "1px solid rgba(0,0,0,0.04)",
              width: "100%"
            }}
          />
        </div>
      </Stack>
    </Stack>
  );
}

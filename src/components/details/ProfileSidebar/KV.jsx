// src/components/details/client-details/ProfileSidebar/KV.jsx
import { Box, Link as MLink, Stack, Typography, TextField } from "@mui/material";
import { dash } from "../ClientDetails/helpers";

export default function KV({
  icon,
  iconColor = "#6b7280",
  label,
  value,
  link,
  // NEW:
  editMode = false,               // if true -> show TextField
  onChange,                       // (newVal) => void
  inputProps = {},                // extra props for TextField
}) {
  const body = link && !editMode ? (
    <MLink href={link} target="_blank" rel="noreferrer" underline="hover">
      {dash(value)}
    </MLink>
  ) : editMode ? (
    <TextField
      size="small"
      fullWidth
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      {...inputProps}
    />
  ) : (
    dash(value)
  );

  return (
    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1.25, lineHeight: 1.2 }}>
      {icon ? (
        <Box sx={{ mt: "2px", color: iconColor, fontSize: 16, flexShrink: 0 }}>
          {icon}
        </Box>
      ) : null}

      <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ color: "text.secondary", fontSize: ".75rem" }}>
          {label}
        </Typography>
        <div className="2xl:text-base lg:text-[.7rem]">{body}</div>
      </Stack>
    </Stack>
  );
}

// src/components/details/client-details/ProfileSidebar/KV.jsx
import { Box, Link, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import { dash } from "../ClientDetails/helpers";
import { FiEdit2 } from "react-icons/fi";

export default function KV({
  icon, iconColor = "#6b7280", label, value,
  link, isContactInfo = false,
  editable = false, onEdit
}) {
  const body = link ? (
    <Link href={link} target="_blank" rel="noreferrer" underline="hover">
      {dash(value)}
    </Link>
  ) : (
    dash(value)
  );

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="flex-start"
      sx={{ mb: 1.25, lineHeight: 1.2 }}
    >
      {icon ? (
        <Box sx={{ mt: "2px", color: iconColor, fontSize: 16, flexShrink: 0 }}>
          {icon}
        </Box>
      ) : null}

      <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ color: "text.secondary", fontSize: ".75rem" }}>
          {label}
        </Typography>

        <div className="flex items-start gap-2">
          <p className="2xl:text-base lg:text-[.7rem] flex-1 break-words">{body}</p>

          {editable ? (
            <Tooltip title={`Edit ${label}`}>
              <IconButton
                size="small"
                onClick={onEdit}
                sx={{ p: 0.5, ml: 0.5 }}
              >
                <FiEdit2 size={14} />
              </IconButton>
            </Tooltip>
          ) : null}
        </div>
      </Stack>
    </Stack>
  );
}

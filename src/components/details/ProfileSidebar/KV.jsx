// src/components/details/client-details/ProfileSidebar/KV.jsx
import { Box, Link, Stack, Typography } from "@mui/material";
import { dash } from "../ClientDetails/helpers";

export default function KV({ icon, iconColor = "#6b7280", label, value, link, isContactInfo = false }) {
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
        <Box
          sx={{
            mt: "2px",
            color: iconColor,
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      ) : null}

      <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: "text.secondary", fontSize: ".75rem" }}
        >
          {label}
        </Typography>
        <p
          className={`2xl:text-base lg:text-[.7rem]`}
        >
          {body}
        </p>
      </Stack>
    </Stack>
  );
}

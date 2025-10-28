// src/components/details/client-details/ProfileSidebar/GroupSection.jsx
import { Box, Stack, Typography } from "@mui/material";

export default function GroupSection({ title, children, icon, iconBg }) {
  return (
    <Box
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        p: 2,
        mb: 2,
        backgroundColor: "#fff",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: 1.5, flexWrap: "wrap" }}
      >
        {icon ? (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 2,
              fontSize: 16,
              display: "grid",
              placeItems: "center",
              fontWeight: 600,
              color: "#fff",
              background:
                iconBg || "linear-gradient(135deg,#5b7fff,#9349ff)",
            }}
          >
            {icon}
          </Box>
        ) : null}

        <Typography
          sx={{
            fontWeight: 600,
            fontSize: ".9rem",
            color: "#111827",
          }}
        >
          {title}
        </Typography>
      </Stack>

      {children}
    </Box>
  );
}

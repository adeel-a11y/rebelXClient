// src/components/details/client-details/ClientDetailsPage.jsx
import * as React from "react";
import { ThemeProvider, Box, Container } from "@mui/material";
import theme from "./theme";

import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";
import ActivityPanel from "../ActivityPanel/ActivityPanel";

export default function ClientDetailsPage() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{ px: 2, py: 3, width: "100%" }}
        >
          <div className="flex xl:flex-row flex-col w-full gap-4">
            <div className="xl:w-[45%]">
              <ProfileSidebar />
            </div>

            <ActivityPanel />
          </div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

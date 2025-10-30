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
          overflowX: "hidden",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{ px: 0, py: 1, width: "100%" }}
        >
          <div className="flex xl:flex-row flex-col w-full gap-4">
            <div className="xl:w-[45%]">
              <ProfileSidebar />
            </div>
            <div className="xl:w-[55%]">
              <ActivityPanel />
            </div>
          </div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

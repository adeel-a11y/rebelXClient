// src/components/details/client-details/ProfileSidebar/CreditCardPreview.jsx
import { Box } from "@mui/material";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { dash } from "../ClientDetails/helpers";

export default function CreditCardPreview({ number, name, expiry, cvc }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        my: 3,
      }}
    >
      <Box
        sx={{
          perspective: "1000px",
          width: 280,
          height: 170,
          cursor: "pointer",
          "&:hover .flipInner": {
            transform: "rotateY(180deg)",
          },
        }}
      >
        <Box
          className="flipInner"
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            transition: "transform 0.6s",
            transformStyle: "preserve-3d",
          }}
        >
          {/* FRONT */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotateY(0deg)",
            }}
          >
            <Cards
              number={dash(number)}
              name={dash(name)}
              expiry={dash(expiry)}
              cvc={dash(cvc)}
              focused={"number"}
            />
          </Box>

          {/* BACK */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotateY(180deg)",
            }}
          >
            <Cards
              number={dash(number)}
              name={dash(name)}
              expiry={dash(expiry)}
              cvc={dash(cvc)}
              focused={"cvc"}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

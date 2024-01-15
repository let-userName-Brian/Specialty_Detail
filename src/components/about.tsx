import { Box, styled } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { forwardRef } from "react";

const About = forwardRef<HTMLElement>((props, ref) => {
  return (
    <StyledAboutWrapper ref={ref}>
      <StyledCard>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <StyledTitle>Our Mission</StyledTitle>
          <StyledBody sx={{ mb: "1.5rem" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            aliquam, velit vitae aliquam dictum, diam nunc aliquam urna, vitae
            aliquam justo nisl id nunc. Donec aliquam, velit vitae aliquam
            dictum, diam nunc aliquam urna, vitae aliquam justo nisl id nunc.
          </StyledBody>
          <StyledBody>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            aliquam, velit vitae aliquam dictum, diam nunc aliquam urna, vitae
            aliquam justo nisl id nunc. Donec aliquam, velit vitae aliquam
            dictum, diam nunc aliquam urna, vitae aliquam justo nisl id nunc.
          </StyledBody>
        </CardContent>
      </StyledCard>
    </StyledAboutWrapper>
  );
});

export default About;

const StyledAboutWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "auto",
});

const StyledCard = styled(Card)({
  width: "50%",
  height: "50%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "2rem",
  borderRadius: "3rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  padding: "2rem",
  "@media (max-width: 600px)": {
    width: "90%",
    height: "100%",
  },
});

const StyledTitle = styled(Typography)({
  fontSize: "4rem",
  fontWeight: "bold",
  color: "white",
  marginBottom: "2rem",
  "@media (max-width: 600px)": {
    fontSize: "2rem",
  },
});

const StyledBody = styled(Typography)({
  fontSize: "1.5rem",
  color: "white",
  "@media (max-width: 600px)": {
    fontSize: "1.2rem",
  },
});

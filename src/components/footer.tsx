import { Box, Typography, styled } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import GoogleIcon from "@mui/icons-material/Google";

export default function Footer() {
  return (
    <StyledFooterWrapper>
      <StyledFollowUsText>Follow Us</StyledFollowUsText>
      <StyledSocialBox>
        <a href="/">
          <FacebookIcon sx={{ color: "white", fontSize: "3rem" }} />{" "}
        </a>
        <a href="/">
          <InstagramIcon sx={{ color: "white", fontSize: "3rem" }} />
        </a>
        <a href="/">
          <GoogleIcon sx={{ color: "white", fontSize: "3rem" }} />
        </a>
      </StyledSocialBox>
      <Box sx={{ color: "rgba(255, 255, 255, 0.2)", fontSize: "1.5rem" }}>
        &copy; 2024 LNBV LLC
      </Box>
    </StyledFooterWrapper>
  );
}

const StyledFooterWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "80%",
  height: "auto",
  gap: "1rem",
  padding: "2rem",
  borderTop: "1px solid rgba(255, 255, 255, 0.2)",
  "@media (max-width: 600px)": {
    marginTop: "2rem",
  },
});

const StyledSocialBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "4rem",
});

const StyledFollowUsText = styled(Typography)({
  fontSize: "2rem",
  fontWeight: "bold",
  color: "white",
});

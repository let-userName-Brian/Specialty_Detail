import { Box, styled } from "@mui/material";
import background from "../assets/images/black-circle2.png";
import logo from "../assets/images/logo.svg";

export default function Main() {
  return (
    <StyledMainWrapper>
      <StyledLogo src={logo} alt=""></StyledLogo>
    </StyledMainWrapper>
  );
}

const StyledMainWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100vh",
  backgroundImage: `url(${background})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflow: "visible",
  "@media (max-width: 600px)": {
    backgroundSize: "260%",
    backgroundPosition: "center",
    marginTop: "-15%",
    marginBottom: "2rem"
  },
});

const StyledLogo = styled("img")({
  width: "20%",
  "@media (max-width: 600px)": {
    width: "50%",
  },
});

import { Box, styled } from "@mui/material";
import Navbar from "./components/navbar";
import Main from "./components/main";
import About from "./components/about";
import Schedule from "./components/schedule";
import Services from "./components/services";
import Testimonials from "./components/testimonials";
import Footer from "./components/footer";
import { useRef } from "react";

export default function App() {
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const scheduleRef = useRef<HTMLElement>(null);

  return (
    <StyledAppWrapper>
      <Navbar
        aboutRef={aboutRef}
        servicesRef={servicesRef}
        testimonialsRef={testimonialsRef}
        scheduleRef={scheduleRef}
      />
      <Main />
      <About ref={aboutRef} />
      <Services ref={servicesRef} />
      <Testimonials ref={testimonialsRef} />
      <Schedule ref={scheduleRef} />
      <Footer />
    </StyledAppWrapper>
  );
}

const StyledAppWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
});

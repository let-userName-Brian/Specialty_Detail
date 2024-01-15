import { Box, Skeleton, styled } from "@mui/material";
import Navbar from "./components/navbar";
import Main from "./components/main";
import Footer from "./components/footer";
import { lazy, Suspense, useRef } from "react";

const About = lazy(() => import("./components/about"));
const Schedule = lazy(() => import("./components/schedule"));
const Services = lazy(() => import("./components/services"));
const Testimonials = lazy(() => import("./components/testimonials"));

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
      <Suspense
        fallback={
          <Skeleton variant="rectangular" width={"90%"} height={"90%"} />
        }
      >
        <About ref={aboutRef} />
        <Services ref={servicesRef} />
        <Testimonials ref={testimonialsRef} />
        <Schedule ref={scheduleRef} />
      </Suspense>
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

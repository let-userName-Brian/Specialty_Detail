import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useRef } from "react";
import { Box, Skeleton, styled } from "@mui/material";
import Navbar from "./components/navbar";
import Main from "./components/main";
import Footer from "./components/footer";
import ReactGA from 'react-ga';

const About = lazy(() => import("./components/about"));
const Schedule = lazy(() => import("./components/schedule"));
const Services = lazy(() => import("./components/services"));
const Testimonials = lazy(() => import("./components/testimonials"));
const Admin = lazy(() => import("./components/admin-components/admin-main"));
const Login = lazy(() => import("./components/admin-components/login"));
const TRACKING_ID = "G-K4Z3CZN5Z2";

export default function App() {
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const scheduleRef = useRef<HTMLElement>(null);

  ReactGA.initialize(TRACKING_ID);

  return (
    <Router>
      <StyledAppWrapper>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar
                  aboutRef={aboutRef}
                  servicesRef={servicesRef}
                  testimonialsRef={testimonialsRef}
                  scheduleRef={scheduleRef}
                />
                <Main />
                <Suspense
                  fallback={
                    <Skeleton
                      variant="rectangular"
                      width={"90%"}
                      height={"90%"}
                    />
                  }
                >
                  <About ref={aboutRef} />
                  <Services ref={servicesRef} />
                  <Testimonials ref={testimonialsRef} />
                  <Schedule ref={scheduleRef} />
                </Suspense>
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense
                fallback={
                  <Skeleton
                    variant="rectangular"
                    width={"90%"}
                    height={"90%"}
                  />
                }
              >
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense
                fallback={
                  <Skeleton
                    variant="rectangular"
                    width={"90%"}
                    height={"90%"}
                  />
                }
              >
                <Admin />
              </Suspense>
            }
          />
        </Routes>
      </StyledAppWrapper>
    </Router>
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

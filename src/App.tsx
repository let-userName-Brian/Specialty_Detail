import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Box, Skeleton, styled } from "@mui/material";
import Navbar from "./components/navbar";
import Main from "./components/main";
import Footer from "./components/footer";
import ReactGA from 'react-ga';
import { getDatabase, onValue, ref } from "firebase/database";
import { firebase } from "./config/firebase";
import wash from "./assets/images/wash.png";
import wax from "./assets/images/wax.png";
import interior from "./assets/images/interior.png";
import fullDetail from "./assets/images/full-detail.png";

const About = lazy(() => import("./components/about"));
const Schedule = lazy(() => import("./components/schedule"));
const Services = lazy(() => import("./components/services"));
const Testimonials = lazy(() => import("./components/testimonials"));
const Admin = lazy(() => import("./components/admin-components/admin-main"));
const Login = lazy(() => import("./components/admin-components/login"));
const TRACKING_ID = "G-K4Z3CZN5Z2";

export type Service = {
  name: string;
  description: string;
  cost: number;
  image: string;
};

export interface ServicesProps {
  currentServices: Service[];
}

export default function App() {
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const scheduleRef = useRef<HTMLElement>(null);
  const [currentServices, setCurrentServices] = useState<Service[]>([]);

  ReactGA.initialize(TRACKING_ID);

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, "/services");

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const dbData: Service[] = snapshot.val();
        const imageArray = [wash, wax, interior, fullDetail];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbData.forEach((service: Service, index: number) => {
          service.image = imageArray[index];
        });
        setCurrentServices(dbData);
      },
      {
        onlyOnce: true,
      }
    );
    return () => unsubscribe();
  }, []);

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
                  <Services ref={servicesRef}  currentServices={currentServices}/>
                  <Testimonials ref={testimonialsRef} />
                  <Schedule ref={scheduleRef} currentServices={currentServices}/>
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

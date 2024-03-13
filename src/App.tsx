import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Box, Skeleton, styled } from "@mui/material";
import Navbar from "./components/navbar";
import Main from "./components/main";
import Footer from "./components/footer";
import { getDatabase, onValue, ref } from "firebase/database";
import { firebase } from "./config/firebase";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import { loggedInUser } from "./components/admin-components/cache/logged-in";

const About = lazy(() => import("./components/about"));
const Schedule = lazy(() => import("./components/schedule"));
const Services = lazy(() => import("./components/services"));
const Testimonials = lazy(() => import("./components/testimonials"));
const Admin = lazy(() => import("./components/admin-components/admin-main"));
const Login = lazy(() => import("./components/admin-components/login"));

interface ProtectedRouteProps {
  children: JSX.Element;
}

export type Service = {
  id: number;
  name: string;
  description: string;
  cost: string;
  image: string;
  imageURL: string;
  additionalImage?: string;
  additionalImageURL?: string;
};

export interface ServicesProps {
  currentServices: Service[];
  calendarUrl: string;
}

export default function App() {
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const scheduleRef = useRef<HTMLElement>(null);
  const [currentServices, setCurrentServices] = useState<Service[]>([]);
  const [calendarUrl, setCalendarUrl] = useState<string>("");

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, "/services");

    const storage = getStorage(firebase);

    const unsubscribe = onValue(dbRef, async (snapshot) => {
      const dbData: Service[] = snapshot.val();
      const promises = Object.values(dbData).map(async (service: Service) => {
        const imagePath = service.image;
        const imageURL = await getDownloadURL(storageRef(storage, imagePath));
        return { ...service, imageURL };
      });

      const updatedServices = await Promise.all(promises);
      setCurrentServices(updatedServices);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, "/calendar");

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const dbData = snapshot.val();
        if (dbData) {
          setCalendarUrl(dbData.public_url);
        }
      },
      {
        onlyOnce: true,
      }
    );
    return () => unsubscribe();
  }, []);

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    if (!loggedInUser) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

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
                  <Services
                    ref={servicesRef}
                    currentServices={currentServices}
                    calendarUrl={calendarUrl}
                  />
                  <Testimonials ref={testimonialsRef} />
                  <Schedule
                    ref={scheduleRef}
                    currentServices={currentServices}
                    calendarUrl={calendarUrl}
                  />
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
                <ProtectedRoute>
                  <Admin
                    currentServices={currentServices}
                    calendarUrl={calendarUrl}
                  />
                </ProtectedRoute>
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
  boxSizing: "border-box",
});

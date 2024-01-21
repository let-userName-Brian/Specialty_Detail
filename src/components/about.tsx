import { Box, styled } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { forwardRef, useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { firebase } from "../config/firebase";
import { renderLoading } from "../helpers/loading-skeletons";

type About = {
  title: string;
  description: string;
  continued?: string;
};

const About = forwardRef<HTMLElement>((_, reference) => {
  const [currentAbout, setCurrentAbout] = useState<About>({
    title: "",
    description: "",
  });

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, "/about");

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const dbData = snapshot.val();
        setCurrentAbout(dbData);
      },
      {
        onlyOnce: true,
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <StyledAboutWrapper ref={reference}>
      <StyledCard>
        {currentAbout.title === "" ? (
          renderLoading()
        ) : (
          <CardContent sx={{ flex: "1 0 auto" }}>
            <StyledTitle>{currentAbout.title}</StyledTitle>
            <StyledBody sx={{ mb: "1.5rem" }}>
              {currentAbout.description}
            </StyledBody>
            <StyledBody sx={{ mb: "1.5rem" }}>
              {currentAbout.continued}
            </StyledBody>
          </CardContent>
        )}
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
  textAlign: "center",
  "@media (max-width: 600px)": {
    fontSize: "2rem",
  },
});

const StyledBody = styled(Typography)({
  fontSize: "1.5rem",
  color: "white",
  textAlign: "center",
  "@media (max-width: 600px)": {
    fontSize: "1.2rem",
  },
});

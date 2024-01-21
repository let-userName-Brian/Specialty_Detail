import { Box, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { forwardRef, useEffect, useState } from "react";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { getDatabase, ref, onValue } from "firebase/database";
import { firebase } from "../config/firebase";
import { renderLoading } from "../helpers/loading-skeletons";

type Review = {
  label: string;
  description: string;
  stars: number;
};

const Testimonials = forwardRef<HTMLElement>((_, reference) => {
  const theme = useTheme();
  const [activeReview, setActiveReview] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const maxReviews = reviews.length;

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, "/testimonials");

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const dbData: Review[] = snapshot.val();
        setReviews(dbData);
      },
      {
        onlyOnce: true,
      }
    );
    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    setActiveReview((prevActiveReview) => prevActiveReview + 1);
  };

  const handleBack = () => {
    setActiveReview((prevActiveReview) => prevActiveReview - 1);
  };

  const renderStars = (starCount: number) => {
    const fullStar = "★";
    const emptyStar = "☆";
    const maxStars = 5;
    let stars = "";
    for (let i = 0; i < maxStars; i++) {
      stars += i < starCount ? fullStar : emptyStar;
    }
    return stars;
  };

  return (
    <StyledTestimonialsWrapper ref={reference}>
      {reviews.length > 0 ? (
        <>
          <StlyedHeader square elevation={0}>
            <StyledLabel>{reviews[activeReview].label}</StyledLabel>
            <StyledLabel sx={{ color: "yellow", fontSize: "2rem" }}>
              {renderStars(reviews[activeReview].stars)}
            </StyledLabel>
          </StlyedHeader>
          <StyledContentBox>
            <StyledContentText>
              {reviews[activeReview].description}
            </StyledContentText>
          </StyledContentBox>
          <MobileStepper
            variant="text"
            steps={maxReviews}
            position="static"
            activeStep={activeReview}
            sx={{
              width: "60%",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              padding: "1.5rem",
              borderBottomLeftRadius: "3rem",
              borderBottomRightRadius: "3rem",
              color: "white",
              "@media (max-width: 600px)": {
                width: "100%",
              },
            }}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeReview === maxReviews - 1}
                sx={{ color: "white" }}
              >
                Next
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeReview === 0}
                sx={{ color: "white" }}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </>
      ) : (
        <>{renderLoading()}</>
      )}
    </StyledTestimonialsWrapper>
  );
});

export default Testimonials;

const StyledTestimonialsWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  flexGrow: 1,
  width: "100%",
  height: "60vh",
  "@media (max-width: 600px)": {
    height: "auto",
    padding: "1rem",
  },
});

const StyledLabel = styled(Typography)({
  fontSize: "1.5rem",
  color: "white",
  "@media (max-width: 600px)": {
    fontSize: "1.2rem",
  },
});

const StlyedHeader = styled(Paper)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: "auto",
  width: "60%",
  padding: "1.5rem",
  paddingLeft: "4rem",
  borderTopLeftRadius: "3rem",
  borderTopRightRadius: "3rem",
  background: "rgba(255, 255, 255, 0.1)",
  "@media (max-width: 600px)": {
    width: "100%",
    paddingLeft: "1.5rem",
  },
});

const StyledContentBox = styled(Box)({
  height: "50%",
  width: "60%",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  borderRight: "1px solid rgba(255, 255, 255, 0.1)",
  borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
  "@media (max-width: 600px)": {
    width: "100%",
  },
});

const StyledContentText = styled(Typography)({
  fontSize: "1.5rem",
  color: "white",
  "@media (max-width: 600px)": {
    fontSize: "1.2rem",
  },
});

import { Box, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { forwardRef, useState } from "react";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

const reviews = [
  {
    label: "Impeccable Attention to Detail",
    description: `The team's attention to detail was impeccable! Every nook and cranny of my car was spotless. 
                      Their dedication to ensuring every part of my vehicle was thoroughly cleaned is truly commendable.`,
    stars: 5,
  },
  {
    label: "Convenient and Efficient Service",
    description:
      "I loved how convenient the service was. They came to my location and did an outstanding job without any hassle. The efficiency and speed of their work were impressive, and my car looked brand new in no time.",
    stars: 4,
  },
  {
    label: "Exceptional Quality",
    description:
      "The quality of the detailing exceeded my expectations. My car hasn't looked this good since I bought it. The shine on the exterior and the pristine interior are simply exceptional.",
    stars: 5,
  },
  {
    label: "Great Value",
    description:
      "The detailing service provided great value for the price. The level of detail and care put into their work is worth every penny. It's refreshing to receive such high-quality service at a reasonable price.",
    stars: 5,
  },
  {
    label: "Professional and Courteous Team",
    description:
      "The detailing team was professional, courteous, and very friendly. They treated my car with great care and were happy to answer any questions. Their customer service is as outstanding as their detailing skills.",
    stars: 4,
  },
];

const Testimonials = forwardRef<HTMLElement>((_, ref) => {
  const theme = useTheme();
  const [activeReview, setActiveReview] = useState(0);
  const maxReviews = reviews.length;

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
    <StyledTestimonialsWrapper ref={ref}>
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

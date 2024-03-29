import {
  getDatabase,
  ref,
  onValue,
  update,
  query,
  orderByKey,
  startAfter,
  limitToLast,
} from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { firebase } from "../../../config/firebase";
import { Review } from "../../testimonials";
import {
  Box,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Typography,
  styled,
} from "@mui/material";

export default function Testimonies() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [filterOn, setFilterOn] = useState("shown");
  const [lastKey, setLastKey] = useState<string | null>(null);
  const cardBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const filteredReviews = reviews.filter((review) => {
      if (filterOn === "shown") {
        return review.shown;
      } else if (filterOn === "not shown") {
        return !review.shown;
      } else {
        return review;
      }
    });
    setFilteredReviews(filteredReviews);
  }, [filterOn, reviews]);

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

  const toggleShown = async (index: number, checked: boolean) => {
    const database = getDatabase(firebase); // Assuming 'firebase' is your Firebase app instance
    const testimonyRef = ref(database, `testimonials/${index}`);

    update(testimonyRef, { shown: checked }).catch((error) => {
      console.error("Error updating testimony: ", error);
    });
  };

  const fetchReviews = async (lastKey: string | null = null) => {
    const database = getDatabase(firebase);
    let reviewsQuery;

    if (lastKey) {
      reviewsQuery = query(
        ref(database, "/testimonials"),
        orderByKey(),
        startAfter(lastKey),
        limitToLast(3)
      );
    } else {
      reviewsQuery = query(
        ref(database, "/testimonials"),
        orderByKey(),
        limitToLast(3)
      );
    }

    onValue(
      reviewsQuery,
      (snapshot) => {
        const data = snapshot.val() || {};
        const fetchedReviews = Object.values(data) as Review[];
        if (fetchedReviews.length > 0) {
          setReviews((prevReviews) => [...prevReviews, ...fetchedReviews]);
          const keys = Object.keys(data);
          setLastKey(keys[keys.length - 1]);
        }
      },
      {
        onlyOnce: true,
      }
    );
  };

  const handleScroll = () => {
    if (!cardBodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = cardBodyRef.current;
    if (scrollHeight - scrollTop <= clientHeight * 1.1) {
      fetchReviews(lastKey);
    }
  };

  return (
    <StyledTestimonialsWrapper>
      <StyledContentBox>
        <StyledCard>
          <StyledCardTitle>Testimonies</StyledCardTitle>
          <FormControl>
            <RadioGroup
              value={filterOn}
              row
              onChange={(e) => setFilterOn(e.target.value)}
            >
              <FormControlLabel
                value="shown"
                control={<StyledRadio />}
                label="Shown"
              />
              <FormControlLabel
                value="not shown"
                control={<StyledRadio />}
                label="Not Shown"
              />
            </RadioGroup>
          </FormControl>
          <StyledCardBody onScroll={handleScroll} ref={cardBodyRef}>
            {filteredReviews.map((review, index) => (
              <StyledTestimony key={index}>
                <Typography variant="h6">{review.label}</Typography>
                <Typography variant="body1">{review.description}</Typography>
                <Typography variant="caption">
                  {renderStars(review.stars)}
                </Typography>
                <FormGroup sx={{ width: "min-content" }}>
                  <FormControlLabel
                    label="Show"
                    control={
                      <Checkbox
                        checked={review.shown}
                        sx={{
                          color: "rgba(255, 255, 255, 0.2)",
                          "&.Mui-checked": {
                            color: "rgba(160,32,240)",
                          },
                        }}
                        onChange={(e) => {
                          toggleShown(index, e.target.checked);
                        }}
                      />
                    }
                  />
                </FormGroup>
              </StyledTestimony>
            ))}
          </StyledCardBody>
        </StyledCard>
      </StyledContentBox>
    </StyledTestimonialsWrapper>
  );
}

const StyledTestimonialsWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  width: "80vw",
  height: "85vh",
});

const StyledContentBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "3rem",
  flex: 1,
  width: "100%",
  height: "90%",
  "@media (max-width: 900px)": {
    flexDirection: "column",
    alignItems: "center",
  },
});

const StyledCard = styled(Card)({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "3rem",
  width: "100%",
  height: "100%",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "2rem",
  overflow: "auto",
  "@media (max-width: 900px)": {
    width: "80%",
    marginBottom: "1rem",
  },
  "@media (max-width: 600px)": {
    width: "100%",
    padding: "1rem",
  },
});

const StyledCardTitle = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "white",
});

const StyledCardBody = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
  height: "100%",
  overflowY: "auto",
  padding: "1rem",
});

const StyledTestimony = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  width: "100%",
  padding: "1rem",
  border: "1px solid white",
  borderRadius: "1rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
});

const StyledRadio = styled(Radio)({
  color: "rgba(255, 255, 255, 0.2)",
  "&.Mui-checked": {
    color: "rgba(160,32,240)",
  },
});

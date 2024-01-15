import Calendar from "@ericz1803/react-google-calendar";
import { css } from "@emotion/react";
import { Box, Typography, styled } from "@mui/material";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const calendars = [
  {
    calendarId: import.meta.env.VITE_GOOGLE_CALENDER_KEY,
  },
];
const styles = {
  calendar: {
    borderWidth: "3px",
    color: "white",
    padding: "1rem",
    borderRadius: "3rem",
  },
  day: {
    color: "white",
  },
  today: css`
    color: red;
    border: 1px solid red;
  `,
};

export default function Calander() {
  return (
    <StyledCalanderWrapper>
      <StyledTitle>Current Availablity</StyledTitle>
      <Calendar apiKey={API_KEY} styles={styles} calendars={calendars} />
    </StyledCalanderWrapper>
  );
}

const StyledCalanderWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "auto",
  gap: "1rem",
  "@media (max-width: 600px)": {
    paddingBottom: "1.5rem",
  },
});

const StyledTitle = styled(Typography)({
  fontSize: "2rem",
  fontWeight: "bold",
  color: "white",
  textAlign: "center",
  "@media (max-width: 600px)": {
    fontSize: "1.5rem",
  },
});

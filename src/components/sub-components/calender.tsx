import { Box, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { renderLoading } from "../../helpers/loading-skeletons";

export default function CalendarComp({ calendarUrl }: { calendarUrl: string }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (calendarUrl.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [calendarUrl]);

  return (
    <StyledCalendarWrapper>
      <StyledTitle>Current Availability</StyledTitle>
      {loading && renderLoading()}
      {!loading && calendarUrl?.length > 0 && (
        <iframe src={calendarUrl}></iframe>
      )}
    </StyledCalendarWrapper>
  );
}

const StyledCalendarWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  gap: "1rem",
  iframe: {
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem",
    border: "none",
    filter: "invert(0.8) hue-rotate(180deg)",
    "@media (max-width: 600px)": {
      minHeight: "70vh",
    }
  },
  "@media (max-width: 600px)": {
    minHeight: "80vh",
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

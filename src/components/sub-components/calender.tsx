import Calendar from "@ericz1803/react-google-calendar";
import { css } from "@emotion/react";
import { Box, Typography, styled } from "@mui/material";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { firebase } from "../../config/firebase";

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

export default function CalendarComp() {
  const [calendars, setCalendars] = useState<{ calendarId: string }[]>([]);
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, "/calendar");

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const dbData = snapshot.val();
        setCalendars([{ calendarId: dbData.calendar_key }]);
        setApiKey(dbData.api_key);
      },
      {
        onlyOnce: true,
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <StyledCalendarWrapper>
      <StyledTitle>Current Availability</StyledTitle>
      {apiKey.length > 0 ? (
        <Calendar apiKey={apiKey} styles={styles} calendars={calendars} />
      ) : null}
    </StyledCalendarWrapper>
  );
}

const StyledCalendarWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
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

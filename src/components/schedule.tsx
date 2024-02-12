import { Box, styled } from "@mui/material";
import CalendarComp from "./sub-components/calender";
import ScheduleForm from "./sub-components/schedule-form";
import { forwardRef } from "react";
import { ServicesProps } from "../App";

const Schedule = forwardRef<HTMLElement, ServicesProps>((props, ref) => {
  const { currentServices, calendarUrl } = props;
  return (
    <StyledScheduleWrapper ref={ref}>
      <StyledCustomCard>
        <CalendarComp calendarUrl={calendarUrl}/>
      </StyledCustomCard>
      <StyledCustomCard>
        <ScheduleForm currentServices={currentServices}/>
      </StyledCustomCard>
    </StyledScheduleWrapper>
  );
});

export default Schedule;

const StyledScheduleWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  width: "100%",
  height: "auto",
  padding: "4rem",
  gap: "5rem",
  "@media (max-width: 600px)": {
    flexDirection: "column",
    padding: "1rem",
  },
});

const StyledCustomCard = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  borderRadius: "3rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  padding: "2rem",
  boxSizing: "border-box",
  overflow: "auto",
  "& .calendar-footer": {
    display: "none",
  },
  "@media (max-width: 600px)": {
    padding: "1rem",
  },
});

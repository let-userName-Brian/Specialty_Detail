import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useState } from "react";
import { logEventToGA } from "../../helpers/events";
import { Service } from "../../App";

const formOptions = [
  { question: "Name", type: "text" },
  { question: "Email", type: "text" },
  { question: "Phone Number", type: "tel" },
  { question: "Address", type: "text" },
  { question: "Date", type: "date" },
  { question: "Time", type: "time" },
  { question: "Service", type: "select" },
  { question: "Message", type: "large-text" },
];

export default function ScheduleForm({
  currentServices,
}: {
  currentServices: Service[];
}) {
  const [selectedService, setSelectedService] = useState("Standard Wash");

  const handleSubmit = () => {
    logEventToGA("Schedule", "Submit", "Schedule Form Submitted");
  };

  const renderInputType = (option: { question: string; type: string }) => {
    switch (option.type) {
      case "text":
        return <StyledTextField variant="standard" label={option.question} />;
      case "tel":
        return <StyledTextField variant="standard" label={option.question} />;
      case "date":
        return <StyledTextField variant="standard" label={option.question} />;
      case "time":
        return <StyledTextField variant="standard" label={option.question} />;
      case "select":
        return (
          <StyledTextField
            variant="standard"
            select
            label={option.question}
            value={selectedService}
          >
            {currentServices.map((option, index: number) => (
              <MenuItem
                key={index}
                value={option.name}
                onClick={() => setSelectedService(option.name)}
              >
                {option.name}
              </MenuItem>
            ))}
          </StyledTextField>
        );
      case "large-text":
        return (
          <StyledTextField
            variant="standard"
            label={option.question}
            multiline
            rows={4}
          />
        );
      default:
        return <StyledTextField variant="standard" label={option.question} />;
    }
  };
  return (
    <StyledFormWrapper>
      <StyledFormTitleBox>
        <StyledFormTitle>Let's get you on the books</StyledFormTitle>
      </StyledFormTitleBox>
      <StyledFormBox>
        {formOptions.map((option, index: number) => (
          <StyledField key={index}>{renderInputType(option)}</StyledField>
        ))}
        <StyledButton variant="contained" onClick={handleSubmit}>
          Submit
        </StyledButton>
      </StyledFormBox>
    </StyledFormWrapper>
  );
}

const StyledFormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  gap: "1rem",
  "@media (max-width: 600px)": {
    paddingBottom: "1.5rem",
  },
});

const StyledFormTitleBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
});

const StyledFormTitle = styled(Typography)({
  fontSize: "2rem",
  fontWeight: "bold",
  color: "white",
  textAlign: "center",
  "@media (max-width: 600px)": {
    fontSize: "1.5rem",
    paddingTop: "1rem",
    paddingBottom: "1rem",
  },
});

const StyledFormBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "80%",
  gap: "1.5rem",
  border: "1px solid white",
  backgroundColor: "rgba(0,0,0,0.5)",
  borderRadius: "2rem",
  padding: "2rem",
  "@media (max-width: 600px)": {
    width: "100%",
  },
});

const StyledField = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const StyledTextField = styled(TextField)({
  width: "80%",
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInput-root": {
    "& input": {
      color: "white",
    },
    "& textarea": {
      color: "white",
    },
    "& select": {
      color: "white",
    },
    "&:before": {
      borderBottomColor: "white",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: "white",
    },
    "&.Mui-focused:after": {
      borderBottomColor: "white",
    },
  },
  "& .MuiSelect-icon": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "white",
    "&.Mui-focused": {
      color: "white",
    },
  },
  "@media (max-width: 600px)": {
    width: "100%",
  },
});

const StyledButton = styled(Button)({
  width: "50%",
  height: "auto",
  borderRadius: "2rem",
  fontSize: "1rem",
  fontWeight: "bold",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  "&:hover": {
    backgroundColor: "rgba(160,32,240)",
  },
  "@media (max-width: 600px)": {
    fontSize: "1rem",
  },
});

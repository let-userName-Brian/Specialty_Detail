import {
  Box,
  Card,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { getDatabase, ref, update } from "firebase/database";
import { firebase } from "../../../config/firebase";

export default function Settings({ calendarUrl }: { calendarUrl: string }) {
  const [editing, setEditing] = useState(false);
  const [tempState, setTempState] = useState("");

  useEffect(() => {
    setTempState(calendarUrl);
  }, [calendarUrl]);

  const handleSave = async () => {
    const database = getDatabase(firebase);
    const serviceRef = ref(database, `/calendar`);
    await update(serviceRef, { public_url: tempState });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setTempState(calendarUrl);
  };

  return (
    <StyledSettingsWrapper>
      <StyledContentBox>
        <StyledCard>
          <StyledCardTitle>Settings</StyledCardTitle>
          <StyledSettingsContentBox>
            {editing ? (
              <StyledPair>
                <StyledTextField
                  label="Calendar URL"
                  variant="standard"
                  multiline
                  value={tempState}
                  onChange={(event) => setTempState(event.target.value)}
                />
                <StyledButtonPair>
                  <IconButton onClick={() => handleCancel()}>
                    <StyledClearIcon />
                  </IconButton>
                  <IconButton onClick={() => handleSave()}>
                    <StyledCheckIcon />
                  </IconButton>
                </StyledButtonPair>
              </StyledPair>
            ) : (
              <Tooltip title="This is the public URL for your calendar.">
                <StyledServicePair>
                  <StyledTitleBox>
                    <StyledHeader>Public Calendar URL:</StyledHeader>
                    <StyledValue>{tempState}</StyledValue>
                  </StyledTitleBox>
                  <IconButton onClick={() => setEditing(true)}>
                    <EditIcon sx={{ color: "white" }} />
                  </IconButton>
                </StyledServicePair>
              </Tooltip>
            )}
          </StyledSettingsContentBox>
        </StyledCard>
      </StyledContentBox>
    </StyledSettingsWrapper>
  );
}

const StyledSettingsWrapper = styled(Box)({
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
  padding: "2rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "3rem",
  width: "100%",
  height: "100%",
  color: "white",
  "@media (max-width: 900px)": {
    width: "80%",
    marginBottom: "1rem",
  },
  "@media (max-width: 600px)": {
    width: "100%",
  },
});

const StyledSettingsContentBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  width: "100%",
  height: "90%",
  overflowY: "auto",
  padding: "2rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "2rem",
});

const StyledCardTitle = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1rem",
  color: "white",
});

const StyledPair = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  width: "100%",
});

const StyledButtonPair = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "20%",
});

const StyledServicePair = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

const StyledValue = styled(Typography)({
  color: "white",
  "@media (max-width: 600px)": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

const StyledHeader = styled(Typography)({
  color: "white",
  fontWeight: "bold",
  fontSize: "1.5rem",
  fontStyle: "italic",
  "@media (max-width: 600px)": {
    fontSize: "1rem",
  },
});

const StyledTitleBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "80%",
});

const StyledTextField = styled(TextField)({
  width: "90%",
  margin: "0 auto",
  marginBottom: "2rem",
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
    width: "90%",
  },
});

const StyledClearIcon = styled(ClearIcon)({
  color: "rgba(255, 0, 0, 0.5)",
});

const StyledCheckIcon = styled(CheckIcon)({
  color: "rgba(160,32,240)",
});

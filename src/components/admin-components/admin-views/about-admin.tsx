import { getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { firebase } from "../../../config/firebase";
import {
  Box,
  Card,
  IconButton,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
} from "@mui/material";
import { renderLoading } from "../../../helpers/loading-skeletons";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

export default function AboutAdmin() {
  const [currentAbout, setCurrentAbout] = useState({
    title: "",
    description: "",
    continued: "",
  });
  const [editState, setEditState] = useState({
    editing: {
      title: false,
      description: false,
      continued: false,
    },
    values: {
      title: "",
      description: "",
      continued: "",
    },
  });

  useEffect(() => {
    setEditState((prevState) => ({
      ...prevState,
      values: { ...currentAbout },
    }));
  }, [currentAbout]);

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, "/about");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const dbData = snapshot.val();
      setCurrentAbout(dbData);
    });
    return () => unsubscribe();
  }, []);

  const toggleEdit = (field) => {
    setEditState((prevState) => ({
      ...prevState,
      editing: {
        ...prevState.editing,
        [field]: !prevState.editing[field],
      },
    }));
  };

  const handleChange = (field, value) => {
    setEditState((prevState) => ({
      ...prevState,
      values: {
        ...prevState.values,
        [field]: value,
      },
    }));
  };

  const saveChanges = (field) => {
    const newValue = editState.values[field];
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/about/${field}`);
    set(dbRef, newValue)
      .then(() => {
        setCurrentAbout((prevState) => ({
          ...prevState,
          [field]: newValue,
        }));
        toggleEdit(field);
      })
      .catch((error) => console.error("Error updating about section: ", error));
  };

  return (
    <StyledAboutWrapper>
      <StyledCard>
        {currentAbout.title === "" ? (
          renderLoading()
        ) : (
          <StyledCardContentBox>
            <StyledAboutSection>
              {editState.editing.title ? (
                <StyledPair>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    value={editState.values.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />

                  <StyledIconButtonWrapper>
                    <IconButton onClick={() => toggleEdit("title")}>
                      <StyledClearIcon />
                    </IconButton>
                    <IconButton onClick={() => saveChanges("title")}>
                      <StyledCheckIcon />
                    </IconButton>
                  </StyledIconButtonWrapper>
                </StyledPair>
              ) : (
                <StyledTextPair>
                  <StyledBody>{currentAbout.title}</StyledBody>
                  <StyledIconButton onClick={() => toggleEdit("title")}>
                    <EditIcon />
                  </StyledIconButton>
                </StyledTextPair>
              )}
            </StyledAboutSection>
            <StyledAboutSection>
              {editState.editing.description ? (
                <StyledPair>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    multiline
                    value={editState.values.description}
                    InputProps={{
                      inputComponent: TextareaAutosize,
                      inputProps: {
                        minRows: 3,
                        maxRows: 15,
                      },
                    }}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                  <StyledIconButtonWrapper>
                    <IconButton onClick={() => toggleEdit("description")}>
                      <StyledClearIcon />
                    </IconButton>
                    <IconButton onClick={() => saveChanges("description")}>
                      <StyledCheckIcon />
                    </IconButton>
                  </StyledIconButtonWrapper>
                </StyledPair>
              ) : (
                <StyledTextPair>
                  <StyledBody>{currentAbout.description}</StyledBody>
                  <StyledIconButton onClick={() => toggleEdit("description")}>
                    <EditIcon />
                  </StyledIconButton>
                </StyledTextPair>
              )}
            </StyledAboutSection>
            <StyledAboutSection>
              {editState.editing.continued ? (
                <StyledPair>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    multiline
                    InputProps={{
                      inputComponent: TextareaAutosize,
                      inputProps: {
                        minRows: 3,
                        maxRows: 15,
                      },
                    }}
                    value={editState.values.continued}
                    onChange={(e) => handleChange("continued", e.target.value)}
                  />
                  <StyledIconButtonWrapper>
                    <IconButton onClick={() => toggleEdit("continued")}>
                      <StyledClearIcon />
                    </IconButton>
                    <IconButton onClick={() => saveChanges("continued")}>
                      <StyledCheckIcon />
                    </IconButton>
                  </StyledIconButtonWrapper>
                </StyledPair>
              ) : (
                <StyledTextPair>
                  <StyledBody>{currentAbout.continued}</StyledBody>
                  <StyledIconButton onClick={() => toggleEdit("continued")}>
                    <EditIcon />
                  </StyledIconButton>
                </StyledTextPair>
              )}
            </StyledAboutSection>
          </StyledCardContentBox>
        )}
      </StyledCard>
    </StyledAboutWrapper>
  );
}

const StyledAboutWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  width: "80vw",
  height: "85vh",
});

const StyledCard = styled(Card)({
  width: "100%",
  height: "100%",
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
    width: "100%",
    height: "100%",
    padding: "1rem",
  },
});

const StyledCardContentBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "100%",
  gap: "1rem",
  overflowY: "auto",
  marginTop: "1rem",
  "& .MuiTextField-root": {
    width: "100%",
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

const StyledTextPair = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  width: "100%",
  padding: "1rem",
});

const StyledTextField = styled(TextField)({
  width: "90%",
  margin: "0 auto",
  marginBottom: "2rem",
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(160,32,240)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "white",
    "&.Mui-focused": {
      color: "rgba(160,32,240)",
    },
  },
  "@media (max-width: 600px)": {
    width: "90%",
  },
});

const StyledPair = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: "1rem",
  gap: "1rem",
  "@media (max-width: 600px)": {
    flexDirection: "column",
  },
});

const StyledAboutSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "1rem",
  width: "100%",
  minHeight: "30%",
  padding: "1rem",
  "@media (max-width: 600px)": {
    minHeight: "auto",
  },
});

const StyledIconButtonWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  gap: "1rem",
  "@media (max-width: 600px)": {
    gap: "0rem",
  },
});

const StyledIconButton = styled(IconButton)({
  color: "white",
});

const StyledClearIcon = styled(ClearIcon)({
  color: "rgba(255, 0, 0, 0.5)",
  fontSize: "2rem",
});

const StyledCheckIcon = styled(CheckIcon)({
  color: "rgba(160,32,240)",
  fontSize: "2rem",
});

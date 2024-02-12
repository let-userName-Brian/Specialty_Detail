import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { Service } from "../../../App";
import { firebase } from "../../../config/firebase";
import { getDatabase, ref, update } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";

export default function EditModal({
  service,
  editModalOpen,
  setEditModalOpen,
  setSelectedService,
}: {
  service: Service;
  editModalOpen: boolean;
  setEditModalOpen: (value: boolean) => void;
  setSelectedService: (service: Service) => void;
}) {
  const [editState, setEditState] = useState({
    name: false,
    description: false,
    cost: false,
  });
  const [tempState, setTempState] = useState({
    name: "",
    description: "",
    cost: 0,
  });

  useEffect(() => {
    setTempState({
      name: service.name,
      description: service.description,
      cost: service.cost,
    });
  }, [service]);

  const handleFileChange = async (event) => {
    const database = getDatabase(firebase);
    const storage = getStorage(firebase);

    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const newImagePath = `services_images/${file.name}`;
    const imageRef = storageRef(storage, newImagePath);

    try {
      await uploadBytes(imageRef, file);

      const newImageURL = await getDownloadURL(imageRef);
      const serviceRef = ref(database, `services/${service.id}`);
      await update(serviceRef, { image: newImagePath, imageURL: newImageURL });

      const updatedService = {
        ...service,
        image: newImagePath,
        imageURL: newImageURL,
      };
      setSelectedService(updatedService);

      console.log("Image uploaded and service updated successfully");
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const handleClick = () => {
    document.getElementById("hiddenFileInput")?.click();
  };

  const handleSave = async (state: string) => {
    const database = getDatabase(firebase);
    const serviceRef = ref(database, `/services/${service.id}`);

    await update(serviceRef, { [state]: tempState[state] });

    setEditState({ ...editState, [state]: false });
  };

  const handleCancel = (state: string) => {
    setEditState({ ...editState, [state]: false });
    setTempState({
      ...tempState,
      [state]: service[state],
    });
  };

  return (
    <Modal
      open={editModalOpen}
      onClose={() => setEditModalOpen(false)}
      aria-labelledby="Edit Service"
      aria-describedby="Edit Service"
    >
      <StyledModalBox>
        <StyledImagePair>
          <StyledImage
            src={service.imageURL}
            alt={service.name}
            loading="lazy"
          />
          <StyledButton variant="contained" onClick={() => handleClick()}>
            Change Photo
          </StyledButton>
          <input
            type="file"
            id="hiddenFileInput"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </StyledImagePair>
        <StyledPair>
          {editState.name ? (
            <StyledPair>
              <StyledTextField
                label="Name"
                variant="standard"
                value={tempState.name}
                onChange={(event) =>
                  setTempState({
                    ...tempState,
                    name: event.target.value,
                  })
                }
              />
              <StyledButtonPair>
                <IconButton onClick={() => handleCancel("name")}>
                  <StyledClearIcon />
                </IconButton>
                <IconButton onClick={() => handleSave("name")}>
                  <StyledCheckIcon />
                </IconButton>
              </StyledButtonPair>
            </StyledPair>
          ) : (
            <StyledServicePair>
              <StyledTitleBox>
                <StyledHeader>Name of Service:</StyledHeader>
                <StyledValue>{tempState.name}</StyledValue>
              </StyledTitleBox>
              <IconButton
                onClick={() => setEditState({ ...editState, name: true })}
              >
                <EditIcon sx={{ color: "white" }} />
              </IconButton>
            </StyledServicePair>
          )}
        </StyledPair>
        <StyledPair>
          {editState.description ? (
            <StyledPair>
              <StyledTextField
                label="Description"
                variant="standard"
                value={tempState.description}
                multiline
                rows={5}
                onChange={(event) =>
                  setTempState({
                    ...tempState,
                    description: event.target.value,
                  })
                }
              />
              <StyledButtonPair>
                <IconButton onClick={() => handleCancel("description")}>
                  <StyledClearIcon />
                </IconButton>
                <IconButton onClick={() => handleSave("description")}>
                  <StyledCheckIcon />
                </IconButton>
              </StyledButtonPair>
            </StyledPair>
          ) : (
            <StyledServicePair>
              <StyledTitleBox>
                <StyledHeader>Description:</StyledHeader>
                <StyledValue>{tempState.description}</StyledValue>
              </StyledTitleBox>
              <IconButton
                onClick={() =>
                  setEditState({ ...editState, description: true })
                }
              >
                <EditIcon sx={{ color: "white" }} />
              </IconButton>
            </StyledServicePair>
          )}
        </StyledPair>
        <StyledPair>
          {editState.cost ? (
            <StyledPair>
              <StyledTextField
                label="Cost"
                variant="standard"
                value={tempState.cost}
                onChange={(event) =>
                  setTempState({
                    ...tempState,
                    cost: +event.target.value,
                  })
                }
              />
              <StyledButtonPair>
                <IconButton onClick={() => handleCancel("cost")}>
                  <StyledClearIcon />
                </IconButton>
                <IconButton onClick={() => handleSave("cost")}>
                  <StyledCheckIcon />
                </IconButton>
              </StyledButtonPair>
            </StyledPair>
          ) : (
            <StyledServicePair>
              <StyledTitleBox>
                <StyledHeader>Cost:</StyledHeader>
                <StyledValue sx={{ color: "green" }}>
                  ${tempState.cost}
                </StyledValue>
              </StyledTitleBox>
              <IconButton
                onClick={() => setEditState({ ...editState, cost: true })}
              >
                <EditIcon sx={{ color: "white" }} />
              </IconButton>
            </StyledServicePair>
          )}
        </StyledPair>
        <StyledCloseBox>
          <Tooltip title="Close" placement="top">
            <IconButton onClick={() => setEditModalOpen(false)}>
              <ClearIcon sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </StyledCloseBox>
      </StyledModalBox>
    </Modal>
  );
}

const StyledModalBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  transform: "translate(-50%, -50%)",
  width: "35%",
  height: "95%",
  borderRadius: "1rem",
  backgroundColor: "rgb(7, 11, 14)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: "2rem",
  overflowY: "auto",
  "@media (max-width: 600px)": {
    padding: "1rem",
    width: "85%",
    height: "85%",
    gap: "1.5rem",
  },
});

const StyledImage = styled("img")({
  width: "100%",
  height: "auto",
  objectFit: "cover",
  borderRadius: "1rem",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  marginBottom: "2rem",
  maxHeight: "100%",
  maxWidth: "70%",
  "@media (max-width: 600px)": {
    maxHeight: "100%",
    maxWidth: "100%",
  },
});

const StyledPair = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  width: "100%",
});

const StyledImagePair = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "2rem",
  padding: "1rem",
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
    width: "auto",
    fontWeight: "normal",
    fontSize: "16px",
    backgroundColor: "rgba(160,32,240)",
  },
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

const StyledCloseBox = styled(Box)({
  color: "white",
  width: "100%",
  display: "flex",
  height: "min-content",
  justifyContent: "center",
});

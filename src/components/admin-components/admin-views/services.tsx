import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { renderLoading } from "../../../helpers/loading-skeletons";
import { Service } from "../../../App";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { getDatabase, ref, set, update } from "firebase/database";
import { firebase } from "../../../config/firebase";

export default function Services({
  currentServices,
}: {
  currentServices: Service[];
}) {
  const [editStates, setEditStates] = useState(
    currentServices.reduce((acc, service) => {
      acc[service.id] = {
        editing: {
          name: false,
          description: false,
          cost: false,
        },
        values: {
          name: service.name,
          description: service.description,
          cost: service.cost,
        },
      };
      return acc;
    }, {})
  );

  const toggleEdit = (id, field) => {
    setEditStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        editing: {
          ...prev[id].editing,
          [field]: !prev[id].editing[field],
        },
      },
    }));
  };

  const handleChange = (id, field, value) => {
    setEditStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        values: {
          ...prev[id].values,
          [field]: value,
        },
      },
    }));
  };

  const confirmEdit = async (id: number, field: keyof Service) => {
    const newValue = editStates[id].values[field];
    const updateData = { [field]: newValue };

    await editService(id, updateData).catch((error) => {
      console.error("Error updating service: ", error);
    });

    toggleEdit(id, field);
  };

  const cancelEdit = (id, field, originalValue) => {
    handleChange(id, field, originalValue);
    toggleEdit(id, field);
  };

  //DB INTERACTIONS
  const addService = async () => {
    const newService: Partial<Service> = {
      id: currentServices.length + 1,
      name: "DEFAULT SERVICE NAME",
      description: "DEFAULT SERVICE DESCRIPTION",
      cost: 0,
    };

    const database = getDatabase(firebase);
    const newIndex = currentServices.length;

    const newServiceRef = ref(database, `/services/${newIndex}`);
    set(newServiceRef, newService)
      .then(() => {
        console.log("Added new service with index: ", newIndex);
      })
      .catch((error) => {
        console.error("Error adding new service: ", error);
      });
  };

  const editService = async (serviceId: number, newData: Partial<Service>) => {
    const database = getDatabase(firebase);
    const serviceRef = ref(database, `/services/${serviceId - 1}`);

    update(serviceRef, newData)
      .then(() => {
        console.log("Service updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating service: ", error);
      });
  };

  return (
    <StyledServicesWrapper>
      <StyledContentBox>
        <StyledCard>
          <StyledCardTitle>Services</StyledCardTitle>
          <StyledCardContentBox>
            {currentServices.length <= 0
              ? renderLoading()
              : currentServices.map((service) => (
                  <StyledServiceBox key={service.id}>
                    <StyledAccordion>
                      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                        {service.name}
                      </StyledAccordionSummary>
                      <StyledAccordionDetails>
                        {editStates[service.id]?.editing.name ? (
                          <StyledPair>
                            <StyledTextField
                              variant="standard"
                              value={editStates[service.id].values.name}
                              onChange={(e) =>
                                handleChange(service.id, "name", e.target.value)
                              }
                            />
                            <StyledIconButtonWrapper>
                              <IconButton
                                onClick={() => confirmEdit(service.id, "name")}
                              >
                                <CheckIcon color="primary" />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  cancelEdit(service.id, "name", service.name)
                                }
                              >
                                <CloseIcon color="secondary" />
                              </IconButton>
                            </StyledIconButtonWrapper>
                          </StyledPair>
                        ) : (
                          <StyledPair>
                            <StyledLabel>Name:</StyledLabel>
                            <StyledValue>{service.name}</StyledValue>
                            <StyledIconButton
                              onClick={() => toggleEdit(service.id, "name")}
                            >
                              <EditIcon />
                            </StyledIconButton>
                          </StyledPair>
                        )}

                        {editStates[service.id]?.editing.cost ? (
                          <StyledPair>
                            <StyledTextField
                              variant="standard"
                              value={editStates[service.id].values.cost}
                              onChange={(e) =>
                                handleChange(service.id, "cost", e.target.value)
                              }
                            />
                            <StyledIconButtonWrapper>
                              <IconButton
                                onClick={() => confirmEdit(service.id, "cost")}
                              >
                                <CheckIcon color="primary" />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  cancelEdit(service.id, "cost", service.cost)
                                }
                              >
                                <CloseIcon color="secondary" />
                              </IconButton>
                            </StyledIconButtonWrapper>
                          </StyledPair>
                        ) : (
                          <StyledPair>
                            <StyledLabel>Cost:</StyledLabel>
                            <StyledValue>{`$${service.cost}`}</StyledValue>
                            <StyledIconButton
                              onClick={() => toggleEdit(service.id, "cost")}
                            >
                              <EditIcon />
                            </StyledIconButton>
                          </StyledPair>
                        )}

                        {editStates[service.id]?.editing.description ? (
                          <StyledPair>
                            <StyledTextField
                              variant="standard"
                              value={editStates[service.id].values.description}
                              multiline
                              rows={2}
                              onChange={(e) =>
                                handleChange(
                                  service.id,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                            <StyledIconButtonWrapper>
                              <IconButton
                                onClick={() =>
                                  confirmEdit(service.id, "description")
                                }
                              >
                                <CheckIcon color="primary" />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  cancelEdit(
                                    service.id,
                                    "description",
                                    service.description
                                  )
                                }
                              >
                                <CloseIcon color="secondary" />
                              </IconButton>
                            </StyledIconButtonWrapper>
                          </StyledPair>
                        ) : (
                          <StyledPair>
                            <StyledLabel>Description:</StyledLabel>
                            <StyledValue>{service.description}</StyledValue>
                            <StyledIconButton
                              onClick={() =>
                                toggleEdit(service.id, "description")
                              }
                            >
                              <EditIcon />
                            </StyledIconButton>
                          </StyledPair>
                        )}
                      </StyledAccordionDetails>
                    </StyledAccordion>
                  </StyledServiceBox>
                ))}
          </StyledCardContentBox>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => addService()}
          >
            Add Service
          </StyledButton>
        </StyledCard>
      </StyledContentBox>
    </StyledServicesWrapper>
  );
}

const StyledServicesWrapper = styled(Box)({
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
  },
});

const StyledCardTitle = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "white",
});

const StyledCardContentBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "100%",
  gap: ".5rem",
  padding: "1rem",
  overflowY: "auto",
  "& .MuiTextField-root": {
    width: "90%",
  },
});

const StyledServiceBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "70%",
  height: "auto",
  "@media (max-width: 600px)": {
    width: "100%",
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
    width: "90%",
  },
});

const StyledPair = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  gap: "1rem",
});

const StyledAccordion = styled(Accordion)({
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  boxShadow: "none",
  color: "white",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: "0",
  },
});

const StyledAccordionSummary = styled(AccordionSummary)({
  "&.Mui-expanded": {
    minHeight: "48px",
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    margin: "12px 0",
  },
});

const StyledAccordionDetails = styled(AccordionDetails)({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  flexDirection: "column",
  padding: "8px 24px",
});

const StyledLabel = styled(Typography)({
  color: "white",
  fontWeight: "bold",
});

const StyledValue = styled(Typography)({
  color: "white",
  fontStyle: "italic",
  "@media (max-width: 600px)": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

const StyledIconButton = styled(IconButton)({
  color: "white",
  marginLeft: "auto",
});

const StyledIconButtonWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  "@media (max-width: 600px)": {
    flexDirection: "column",
    gap: "0",
  },
});

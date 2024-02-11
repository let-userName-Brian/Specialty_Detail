import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  // TextField,
  Typography,
  styled,
} from "@mui/material";
import { renderLoading } from "../../../helpers/loading-skeletons";
import { Service } from "../../../App";
// import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
// import CheckIcon from "@mui/icons-material/Check";
// import CloseIcon from "@mui/icons-material/Close";
import { getDatabase, ref, set, /*update*/ } from "firebase/database";
import { firebase } from "../../../config/firebase";

export default function Services({
  currentServices,
}: {
  currentServices: Service[];
}) {
  // const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  // const [editStates, setEditStates] = useState(
  //   currentServices.reduce((acc, service) => {
  //     acc[service.id] = {
  //       editing: {
  //         name: false,
  //         description: false,
  //         cost: false,
  //       },
  //       values: {
  //         name: service.name,
  //         description: service.description,
  //         cost: service.cost,
  //       },
  //     };
  //     return acc;
  //   }, {})
  // );

  // const toggleEdit = (id, field) => {
  //   setEditStates((prev) => ({
  //     ...prev,
  //     [id]: {
  //       ...prev[id],
  //       editing: {
  //         ...prev[id].editing,
  //         [field]: !prev[id].editing[field],
  //       },
  //     },
  //   }));
  // };

  // const handleChange = (id, field, value) => {
  //   setEditStates((prev) => ({
  //     ...prev,
  //     [id]: {
  //       ...prev[id],
  //       values: {
  //         ...prev[id].values,
  //         [field]: value,
  //       },
  //     },
  //   }));
  // };

  // const confirmEdit = async (id: number, field: keyof Service) => {
  //   const newValue = editStates[id].values[field];
  //   const updateData = { [field]: newValue };

  //   await editService(id, updateData).catch((error) => {
  //     console.error("Error updating service: ", error);
  //   });

  //   toggleEdit(id, field);
  // };

  // const cancelEdit = (id, field, originalValue) => {
  //   handleChange(id, field, originalValue);
  //   toggleEdit(id, field);
  // };

  //DB INTERACTIONS
  const addService = async () => {
    const newService: Partial<Service> = {
      id: currentServices.length + 1,
      name: "DEFAULT SERVICE NAME",
      description: "DEFAULT SERVICE DESCRIPTION",
      cost: 0,
      image:
        "gs://specialty-detail.appspot.com/services_images/full-detail-BbKdWSxI.png",
      imageURL: "DEFAULT IMAGE URL",
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

  // const editService = async (serviceId: number, newData: Partial<Service>) => {
  //   const database = getDatabase(firebase);
  //   const serviceRef = ref(database, `/services/${serviceId - 1}`);

  //   update(serviceRef, newData)
  //     .then(() => {
  //       console.log("Service updated successfully!");
  //     })
  //     .catch((error) => {
  //       console.error("Error updating service: ", error);
  //     });
  // };

  return (
    <StyledServicesWrapper>
      <StyledContentBox>
        <StyledCard>
          <StyledCardContentBox>
            {currentServices.length <= 0
              ? renderLoading()
              : currentServices.map((service) => (
                  <StyledServiceCard key={service.id}>
                    <StyledCardActionArea disableRipple>
                      <StyledCardMedia image={service.imageURL} />
                      <StyledCardContent>
                        <StyledServiceCardTitle gutterBottom>
                          {service.name}
                        </StyledServiceCardTitle>
                        <StyledCardDescription>
                          {service.description}
                        </StyledCardDescription>
                        <StyledCardPrice>${service.cost}</StyledCardPrice>
                      </StyledCardContent>
                      <StyledEditBox>
                        <IconButton
                          onClick={() =>
                            console.log("Edit service", service.id)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </StyledEditBox>
                    </StyledCardActionArea>
                  </StyledServiceCard>
                ))}
          </StyledCardContentBox>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => addService()}
          >
            New Service
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
    padding: '1rem'
  },
});

const StyledCardContentBox = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(20%, 1fr))",
  gridAutoRows: "minmax(90%, auto)",
  gap: "1rem",
  width: "100%",
  height: "100%",
  padding: "1rem",
  overflowY: "auto",
  "& .MuiTextField-root": {
    width: "90%",
  },
  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
    padding: '0',
    marginBottom: "1rem",
  },
});

const StyledServiceCard = styled(Card)({
  padding: "1rem",
  flex: "1 1 auto",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "3rem",
  height: "100%",
});

const StyledCardActionArea = styled(CardActionArea)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  gap: "1rem",
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "default",
  },
});

const StyledCardMedia = styled(CardMedia)({
  width: "100%",
  height: "40%",
  borderRadius: "3rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
});

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flex: "1",
  width: "100%",
  gap: "1rem",
});

const StyledServiceCardTitle = styled(Typography)({
  fontSize: "2rem",
  fontWeight: 900,
  textAlign: "center",
  color: "white",
  "@media (max-width: 600px)": {
    fontSize: "1.7rem",
  },
});

const StyledCardDescription = styled(Typography)({
  fontSize: "1rem",
  fontWeight: 400,
  textAlign: "center",
  color: "white",
  "@media (max-width: 600px)": {
    fontSize: "1.2rem",
  },
});

const StyledCardPrice = styled(Typography)({
  fontSize: "1rem",
  fontWeight: 400,
  textAlign: "center",
  color: "green",
  fontStyle: "italic",
  "@media (max-width: 600px)": {
    fontSize: "1.2rem",
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

const StyledEditBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  gap: "1rem",
  "& .MuiIconButton-root": {
    color: "white",
  },
  "@media (max-width: 600px)": {
    justifyContent: "center",
  },
});

// const StyledTextField = styled(TextField)({
//   width: "90%",
//   margin: "0 auto",
//   marginBottom: "2rem",
//   "& .MuiInputBase-input": {
//     color: "white",
//   },
//   "& .MuiInput-root": {
//     "& input": {
//       color: "white",
//     },
//     "& textarea": {
//       color: "white",
//     },
//     "& select": {
//       color: "white",
//     },
//     "&:before": {
//       borderBottomColor: "white",
//     },
//     "&:hover:not(.Mui-disabled):before": {
//       borderBottomColor: "white",
//     },
//     "&.Mui-focused:after": {
//       borderBottomColor: "white",
//     },
//   },
//   "& .MuiSelect-icon": {
//     color: "white",
//   },
//   "& .MuiInputLabel-root": {
//     color: "white",
//     "&.Mui-focused": {
//       color: "white",
//     },
//   },
//   "@media (max-width: 600px)": {
//     width: "90%",
//   },
// });

// const StyledPair = styled(Box)({
//   display: "flex",
//   flexDirection: "row",
//   alignItems: "center",
//   width: "100%",
//   gap: "1rem",
//   "&.edit": {
//     "@media (max-width: 600px)": {
//       flexDirection: "column",
//       gap: "0",
//     },
//   },
// });

// const StyledLabel = styled(Typography)({
//   color: "white",
//   fontWeight: "bold",
// });

// const StyledValue = styled(Typography)({
//   color: "white",
//   fontStyle: "italic",
//   "@media (max-width: 600px)": {
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//   },
// });

// const StyledIconButtonWrapper = styled(Box)({
//   display: "flex",
//   flexDirection: "row",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: "1rem",
//   "@media (max-width: 600px)": {
//     gap: "0",
//   },
// });

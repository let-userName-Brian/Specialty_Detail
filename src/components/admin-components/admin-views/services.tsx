import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  styled,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { renderLoading } from "../../../helpers/loading-skeletons";
import { Service } from "../../../App";
import { getDatabase, ref /*update*/, remove, set } from "firebase/database";
import { firebase } from "../../../config/firebase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import EditModal from "./edit-modal";

const DEFAULT_SERVICE: Service = {
  id: uuidv4(),
  name: "DEFAULT SERVICE NAME",
  description: "DEFAULT SERVICE DESCRIPTION",
  cost: "0",
  image:
    "gs://specialty-detail.appspot.com/services_images/full-detail-BbKdWSxI.png",
  imageURL: "DEFAULT IMAGE URL",
};

const options = ["Edit", "Delete", "Duplicate"];
const ITEM_HEIGHT = 48;

export default function Services({
  currentServices,
}: {
  currentServices: Service[];
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<Service>(DEFAULT_SERVICE);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleIconClick = (
    service: Service,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setSelectedService(service);
    setAnchorEl(event.currentTarget);
  };

  const handleSelection = async (option: string) => {
    switch (option) {
      case "Edit":
        setEditModalOpen(true);
        break;
      case "Delete":
        await deleteService(selectedService.id);
        break;
      case "Duplicate":
        await addService({
          ...selectedService,
          id: uuidv4(),
        });
        break;
      default:
        console.log("Invalid option selected!");
        break;
    }
    handleClose();
  };

  //DB INTERACTIONS
  const addService = async (serviceToAdd?: Service) => {
    const service = serviceToAdd ?? DEFAULT_SERVICE;
    const database = getDatabase(firebase);

    const newServiceRef = ref(database, `/services/${service.id}`);
    set(newServiceRef, service)
      .then(() => {
        console.log("Added new service with index: ", service.id);
      })
      .catch((error) => {
        console.error("Error adding new service: ", error);
      });
  };

  const deleteService = async (serviceId: number) => {
    const database = getDatabase(firebase);
    const serviceRef = ref(database, `/services/${serviceId}`);

    remove(serviceRef)
      .then(() => {
        console.log("Service deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting service: ", error);
      });
  };

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
                        <StyledCardPrice>{service.cost}</StyledCardPrice>
                      </StyledCardContent>
                    </StyledCardActionArea>
                    <StyledEditBox>
                      <IconButton
                        onClick={(event) => handleIconClick(service, event)}
                      >
                        <MoreVertIcon
                          sx={{
                            transform: "rotate(90deg)",
                          }}
                        />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "20ch",
                          },
                        }}
                      >
                        {options.map((option) => (
                          <MenuItem
                            key={option}
                            onClick={() => handleSelection(option)}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </Menu>
                    </StyledEditBox>
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
      <EditModal
        service={selectedService}
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        setSelectedService={setSelectedService}
      />
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
    padding: "1rem",
  },
});

const StyledCardContentBox = styled(Box)({
  // display: "grid",
  // gridTemplateColumns: "repeat(auto-fill, minmax(20%, 1fr))",
  // gridAutoRows: "minmax(90%, auto)",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",

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
    padding: "0",
    marginBottom: "1rem",
  },
});

const StyledServiceCard = styled(Card)({
  padding: "1rem",
  backgroundColor: "rgba(255, 255, 255, 0.01)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "3rem",
  minHeight: "clamp(25rem, 50vh, 25rem)",
  width: "clamp(25rem, 50vw, 15rem)",
});

const StyledCardActionArea = styled(CardActionArea)({
  height: "93%",
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
  width: "clamp(23rem, 50vw, 23rem)",
  height: "clamp(15rem, 50vw, 20rem)",
  borderRadius: "3rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  "@media (max-width: 600px)": {
    width: "95%",
    height: "18rem",
  },
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

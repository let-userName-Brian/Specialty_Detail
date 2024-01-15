import { Box, styled } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { forwardRef, useState } from "react";
import wash from "../assets/images/wash.png";
import wax from "../assets/images/wax.png";
import interior from "../assets/images/interior.png";
import fullDetail from "../assets/images/full-detail.png";

const Services = forwardRef<HTMLElement>((_, ref) => {
  const [currentServices] = useState([
    {
      name: "Exterior Detailing",
      description: "Exterior detailing description",
      price: 100,
      image: wash,
    },
    {
      name: "Interior Detailing",
      description: "Interior detailing description",
      price: 100,
      image: interior,
    },
    {
      name: "Full Detailing",
      description: "Full detailing description",
      price: 100,
      image: fullDetail,
    },
    {
      name: "Wash and Wax",
      description: "Wash and wax description",
      price: 100,
      image: wash,
    },
    {
      name: "Ceramic Coating",
      description: "Ceramic coating description",
      price: 500,
      image: wax,
    },
  ]);

  return (
    <StyledServicesWrapper ref={ref}>
      {currentServices.map((service, index: number) => (
        <StyledCard key={index}>
          <CardActionArea>
            <StyledCardMedia image={service.image} />
            <StyledCardContent>
              <StyledCardTitle gutterBottom>{service.name}</StyledCardTitle>
              <StyledCardDescription>
                {service.description}
              </StyledCardDescription>
              <StyledCardPrice>${service.price}</StyledCardPrice>
            </StyledCardContent>
          </CardActionArea>
        </StyledCard>
      ))}
    </StyledServicesWrapper>
  );
})

export default Services;

const StyledServicesWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  flexWrap: "wrap",
  alignItems: "center",
  width: "100%",
  height: "auto",
  gap: "3rem",
  padding: "2rem",
  "@media (max-width: 600px)": {
    flexDirection: "column",
    padding: "1rem",
    marginTop: "2rem",
  },
});

const StyledCard = styled(Card)({
  minWidth: "20%",
  maxWidth: "20%",
  padding: "1rem",
  flex: "1 1 auto",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "3rem",
  "@media (max-width: 600px)": {
    minWidth: "100%",
    maxWidth: "100%",
  },
});

const StyledCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: "75%",
  borderRadius: "3rem",
});

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
  flex: "1 1 auto",
  gap: "1rem",
});

const StyledCardTitle = styled(Typography)({
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

import { Box, styled } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { forwardRef } from "react";
import { renderLoading } from "../helpers/loading-skeletons";
import { ServicesProps } from "../App";

const Services = forwardRef<HTMLElement, ServicesProps>((props, reference) => {
  const { currentServices } = props;

  return (
    <StyledServicesWrapper ref={reference}>
      {currentServices.length === 0 ? (
        renderLoading()
      ) : (
        <>
          {currentServices.map((service, index: number) => (
            <StyledCard key={index}>
              <StyledCardActionArea disableRipple>
                <StyledCardMedia image={service.imageURL} />
                <StyledCardContent>
                  <StyledCardTitle gutterBottom>{service.name}</StyledCardTitle>
                  <StyledCardDescription>
                    {service.description}
                  </StyledCardDescription>
                  <StyledCardPrice>${service.cost}</StyledCardPrice>
                </StyledCardContent>
              </StyledCardActionArea>
            </StyledCard>
          ))}
        </>
      )}
    </StyledServicesWrapper>
  );
});

export default Services;

const StyledServicesWrapper = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(20%, 1fr))",
  gridAutoRows: "auto",
  gap: "3rem",
  padding: "2rem",
  width: "100%",
  height: "auto",
  marginTop: "2rem",
  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
    padding: "1rem",
    marginTop: "2rem",
  },
});

const StyledCard = styled(Card)({
  padding: "1rem",
  flex: "1 1 auto",
  minHeight: "clamp(400px, 50vh, 500px)",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "3rem",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
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
  height: "90%",
  borderRadius: "3rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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

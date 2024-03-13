import { Box, styled } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import { renderLoading } from "../helpers/loading-skeletons";
import { ServicesProps } from "../App";

const Services = forwardRef<HTMLElement, ServicesProps>((props, reference) => {
  const { currentServices } = props;

  const [currentImages, setCurrentImages] = useState<{
    [index: number]: string;
  }>({});

  useEffect(() => {
    const intervalIds: { [index: number]: NodeJS.Timeout } = {};

    currentServices.forEach((service, index) => {
      if (service.additionalImageURL) {
        setCurrentImages((prev) => ({ ...prev, [index]: service.imageURL }));
        intervalIds[index] = setInterval(() => {
          console.log("Toggling image");
          setCurrentImages((prev) => {
            // Ensure that we have a valid URL before toggling
            const nextImage =
              prev[index] === service.imageURL && service.additionalImageURL
                ? service.additionalImageURL
                : service.imageURL;
            return { ...prev, [index]: nextImage };
          });
        }, 3000);
      }
    });

    // Clear intervals on component unmount
    return () => {
      Object.values(intervalIds).forEach(clearInterval);
    };
  }, [currentServices]);
  return (
    <StyledServicesWrapper ref={reference}>
      {currentServices.length === 0 ? (
        renderLoading()
      ) : (
        <>
          {currentServices.map((service, index: number) => (
            <StyledCard key={index}>
              <StyledCardActionArea disableRipple>
                <StyledCardMedia
                  image={currentImages[index] || service.imageURL}
                />
                {/* before and after text on rotating image */}
                <StyledCardContent>
                  <StyledCardTitle gutterBottom>{service.name}</StyledCardTitle>
                  <StyledCardDescription>
                    {service.description}
                  </StyledCardDescription>
                  <StyledCardPrice>{service.cost}</StyledCardPrice>
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
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "3rem",
  padding: "2rem",
  width: "100%",
  height: "auto",
  marginTop: "2rem",
  "@media (max-width: 600px)": {
    padding: "1rem",
    marginTop: "2rem",
  },
});

const StyledCard = styled(Card)({
  padding: "1rem",
  minHeight: "clamp(25rem, 50vh, 25rem)",
  width: "clamp(25rem, 50vw, 15rem)",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "3rem",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
  "@media (max-width: 600px)": {
    width: "95%",
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

/**
 * @keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.image-fade-out {
  animation: fadeOut 1s forwards;
}

.image-fade-in {
  animation: fadeIn 1s forwards;
}
 */

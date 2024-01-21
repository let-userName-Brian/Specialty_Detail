import { Skeleton } from "@mui/material";

export const renderLoading = () => {
  return (
    <>
      <Skeleton
        animation="wave"
        variant="rectangular"
        height="80%"
        style={{ marginTop: "2rem", borderRadius: "2rem" }}
      />
      <Skeleton
        animation="wave"
        height="10%"
        style={{ marginBottom: "2rem", borderRadius: "2rem" }}
      />
    </>
  );
};

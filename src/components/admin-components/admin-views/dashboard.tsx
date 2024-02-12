import { Box, Card, Typography, styled } from "@mui/material";
import { renderLoading } from "../../../helpers/loading-skeletons";
import { useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { firebase } from "../../../config/firebase";
import { FlattenedData, fetchAnalyticsDataIfNeeded } from "../cache/analytics-cache";
import BarChart from "./bar-chart";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [gaError, setGAError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<FlattenedData[] | null>(
    null
  );

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    const functions = getFunctions(firebase);
    const fetchAnalytics = () =>
      httpsCallable(functions, "fetchAnalyticsData")();

    fetchAnalyticsDataIfNeeded(fetchAnalytics)
      .then((cachedData) => {
        setLoading(false);
        if(gaError) setGAError(null);
        setAnalyticsData(cachedData);
      })
      .catch(() => {
        setLoading(false);
        setGAError("Error fetching analytics data");
      });
  };

  return (
    <StyledDashboardWrapper>
      <StyledContentBox>
        <StyledCard>
          <StyledCardTitle>Site Traffic By City</StyledCardTitle>
          <StyledCardContent>
            {gaError && (
              <StyledNoContentBox>
                <StyledErrorMessage>{gaError}</StyledErrorMessage>
              </StyledNoContentBox>
            )}
            {loading && renderLoading()}
            {analyticsData && !loading && !gaError && (
              <BarChart analyticsData={analyticsData} />
            )}
          </StyledCardContent>
        </StyledCard>
      </StyledContentBox>
    </StyledDashboardWrapper>
  );
}

const StyledDashboardWrapper = styled(Box)({
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

const StyledNoContentBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  gap: "1rem",
});

const StyledCardTitle = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1rem",
  color: "white",
});

const StyledErrorMessage = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1rem",
});

const StyledCardContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "1rem",
  height: "90%",
});

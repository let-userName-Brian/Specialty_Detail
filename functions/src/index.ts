/* eslint-disable */
import * as functions from "firebase-functions";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

exports.fetchAnalyticsData = functions.https.onCall(async (data, context) => {
  const privateKey = functions.config().someservice.key.replace(/\\n/g, '\n');
  const privateEmail = functions.config().someservice.email;
  const privateGtag = functions.config().someservice.gtag;

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: privateEmail,
      private_key: privateKey,
    },
  });

  try {
    const [reportResponse] = await analyticsDataClient.runReport({
      property: `properties/${privateGtag}`,
      dateRanges: [{ startDate: "2022-01-01", endDate: "today" }],
      dimensions: [{ name: "city" }],
      metrics: [{ name: "activeUsers" }],
    });
    return reportResponse;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to fetch analytics data",
      error
    );
  }
});

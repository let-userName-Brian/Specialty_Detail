interface DimensionValue {
  value: string;
  oneValue: string;
}

interface MetricValue {
  value: string;
  oneValue: string;
}

export interface FlattenedData {
  dimensionValue: string;
  metricValue: string;
}

let cache: FlattenedData[] | null = null;

export const fetchAnalyticsDataIfNeeded = async (
  fetchAnalyticsData: () => Promise<any>
) => {
  if (!cache) {
    try {
      const result = await fetchAnalyticsData();
      cache = flattenData(result.data.rows);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      throw error;
    }
  }
  return cache;
};

function flattenData(
  data: Array<{
    dimensionValues: DimensionValue[];
    metricValues: MetricValue[];
  }>
): FlattenedData[] {
  return data?.map((item) => ({
    dimensionValue: item.dimensionValues[0].value,
    metricValue: item.metricValues[0].value,
  }));
}

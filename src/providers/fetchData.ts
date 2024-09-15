import axios from "axios";
import { ref } from "vue";
import { Launch } from "../providers/Launch";

export const launches = ref<Launch[]>([]);

// Fetch ID names 
export const fetchCrewNames = async (crewIds: string[]): Promise<string[]> => {
  if (!crewIds.length) return [];
  const crewNames = await Promise.all(
    crewIds.map(async (id) => {
      const response = await axios.get(`https://api.spacexdata.com/v4/crew/${id}`);
      return response.data.name;
    })
  );
  return crewNames;
};

export const fetchRocketName = async (rocketId: string): Promise<string> => {
  const response = await axios.get(`https://api.spacexdata.com/v4/rockets/${rocketId}`);
  return response.data.name;
};

export const fetchLaunchpadName = async (launchpadId: string): Promise<string> => {
  const response = await axios.get(`https://api.spacexdata.com/v4/launchpads/${launchpadId}`);
  return response.data.name;
};
export const fetchLaunches = async (): Promise<void> => {
  try {
    const response = await axios.get<Launch[]>(
      "https://api.spacexdata.com/v4/launches"
    );
    const launchData = response.data;

    // Mapping data
    const detailedLaunches = await Promise.all(
      launchData.map(async (launch) => {
        const [crewData, rocketData, launchpadData] = await Promise.all([
          fetchCrewNames(launch.crew),
          fetchRocketName(launch.rocket),
          fetchLaunchpadName(launch.launchpad)
        ]);

        // Combine data
        return {
          ...launch,
          crew: crewData,
          rocket: rocketData,
          launchpad: launchpadData
        };
      })
    );

    launches.value = detailedLaunches;
  } catch (error) {
    console.error("Failed to fetch launches or details:", error);
  }
};


import axios from "axios";
import { ref } from "vue";
import { Launch } from "../providers/Launch";

export const launches = ref<Launch[]>([]);

export const fetchLaunches = async (): Promise<void> => {
  try {
    const response = await axios.get<Launch[]>(
      "https://api.spacexdata.com/v4/launches"
    );
    launches.value = response.data;
  } catch (error) {
    console.error("Failed to fetch launches:", error);
  }
};

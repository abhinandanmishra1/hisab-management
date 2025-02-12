import { CreateHisabPayload } from "@/types";
import axios from "axios";
const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Set API base URL
  withCredentials: true, // Include cookies if needed
});

export const createHisab = async (hisab: CreateHisabPayload) => {
    const { data } = await apiClient.post("/api/hisab", hisab);
    return data;
};

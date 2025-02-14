import { CreateHisabPayload } from "@/types";
import axios from "axios";
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Include cookies if needed
});

export const createHisab = async (hisab: CreateHisabPayload) => {
    const { data } = await apiClient.post("/api/hisab", hisab);
    return data;
};

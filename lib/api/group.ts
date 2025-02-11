import { CreateGroupPayload } from "@/types";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Set API base URL
  withCredentials: true, // Include cookies if needed
});

export const getGroupById = async (id: string) => {
  console.log(id);
  const { data } = await apiClient.get(`/api/group/${id}`);
  return data;
};

export const createGroup = async (groupData: CreateGroupPayload) => {
  const { data } = await apiClient.post("/api/group", groupData);
  return data;
};
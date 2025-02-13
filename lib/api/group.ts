import { CreateGroupPayload } from "@/types";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Set API base URL
  withCredentials: true, // Include cookies if needed
});

export const getGroupById = async (id: string) => {
  console.log(id);
  const { data } = await apiClient.get(`/api/group/${id}`);

  console.log("mera data", data);
  return data;
};

export const createGroup = async (groupData: CreateGroupPayload) => {
  const { data } = await apiClient.post("/api/group", groupData);
  return data;
};

export const getGroups = async () => {
  const { data } = await apiClient.get("/api/group");
  return data;
};

export const getHisabsByGroupId = async (groupId: string) => {
  const { data } = await apiClient.get(`/api/group/${groupId}/hisabs`);
  return data.data;
}

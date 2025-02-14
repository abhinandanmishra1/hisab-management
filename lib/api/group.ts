import { CreateGroupPayload } from "@/types";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Include cookies if needed
});

export const getGroupById = async (id: string) => {
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

import { CreateGroupPayload } from "@/types";
import { createApiClient } from "../apiClient";

const apiClient = createApiClient();

export const getGroupById = async (id: string) => {
  const { data } = await apiClient.get(`/api/group/${id}`);

  console.log("mera data", data);
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

import { createApiClient } from "../apiClient";

const apiClient = createApiClient();

export const getUsers = async () => {
  const { data } = await apiClient.get("/api/user");
  return data;
};

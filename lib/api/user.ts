import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Include cookies if needed
});

export const getUsers = async () => {
  const { data } = await apiClient.get("/api/user");
  return data;
};

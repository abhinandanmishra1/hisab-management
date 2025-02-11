import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Set API base URL
  withCredentials: true, // Include cookies if needed
});

export const getUsers = async () => {
  const { data } = await apiClient.get("/api/user");
  return data;
};

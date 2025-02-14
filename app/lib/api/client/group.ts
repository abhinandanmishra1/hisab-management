import { CreateGroupPayload } from "@/types";
import axios from "axios";

export const createGroup = async (groupData: CreateGroupPayload) => {
  const { data } = await axios.post("/api/group", groupData);
  return data;
};
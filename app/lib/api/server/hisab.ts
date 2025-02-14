import { CreateHisabPayload } from "@/types";
import { createApiClient } from "../apiClient";
const apiClient = createApiClient();

export const createHisab2 = async (hisab: CreateHisabPayload) => {
    const { data } = await apiClient.post("/api/hisab", hisab);
    return data;
};

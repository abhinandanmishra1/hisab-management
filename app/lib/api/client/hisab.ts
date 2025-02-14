import { CreateHisabPayload } from "@/types";
import axios from "axios";
export const createHisab = async (hisab: CreateHisabPayload) => {
    const { data } = await axios.post("/api/hisab", hisab);
    return data;
};

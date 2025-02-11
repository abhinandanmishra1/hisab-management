import { NextResponse } from "next/server";
import { apiClient } from "@/utils/axiosInstance";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Fetching group with ID:", id);
    const response = await apiClient.get(`/group/${id}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(`Error fetching group with ID ${params.id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

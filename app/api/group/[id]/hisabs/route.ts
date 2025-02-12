import { NextResponse } from "next/server";
import { apiClient } from "@/utils/axiosInstance";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { data } = await apiClient.get(`/group/${id}/hisabs`);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching hisabs of group ${params.id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

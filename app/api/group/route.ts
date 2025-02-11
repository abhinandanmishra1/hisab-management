import { Group } from "@/types/group"; // Import type
import { NextResponse } from "next/server";
import { apiClient } from "@/utils/axiosInstance";

export async function POST(req: Request) {
  try {
    const groupData: Group = await req.json();
    const response = await apiClient.post("/group", groupData);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await apiClient.get("/group");
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GetById(id: string) {
  try {
    const response = await apiClient.get(`/group/${id}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

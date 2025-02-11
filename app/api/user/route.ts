import { NextResponse } from 'next/server';
import { User } from '@/types/user'; // Import type
import { apiClient } from '@/utils/axiosInstance';

export async function POST(req: Request) {
  try {
    const userData: User = await req.json();
    const response = await apiClient.post('/user', userData);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await apiClient.get('/user');
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

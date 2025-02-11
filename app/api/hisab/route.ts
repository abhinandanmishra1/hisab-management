import { Hisab } from '@/types'; // Import type
import { NextResponse } from 'next/server';
import { apiClient } from '@/utils/axiosInstance';

export async function POST(req: Request) {
  try {
    const hisabData: Hisab = await req.json();
    const response = await apiClient.post('/hisab', hisabData);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await apiClient.get('/hisab');
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

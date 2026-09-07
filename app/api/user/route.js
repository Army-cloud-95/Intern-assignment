import { NextResponse } from 'next/server';
import { getActiveUser, setActiveUser } from '@/lib/db';

export async function GET(request) {
  try {
    const user = getActiveUser();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active user' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { memberId } = await request.json();
    const user = setActiveUser(memberId);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to switch user' }, { status: 500 });
  }
}

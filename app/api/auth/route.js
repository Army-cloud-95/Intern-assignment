import { NextResponse } from 'next/server';
import { getMembers } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const members = getMembers();
    const user = members.find(m => m.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Demo auth token
    const token = `nova-jwt-demo-token-${user.id}-${Date.now()}`;
    return NextResponse.json({
      user,
      token,
      message: 'Authentication successful'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

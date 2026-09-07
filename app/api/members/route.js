import { NextResponse } from 'next/server';
import { getMembers, createMember } from '@/lib/db';

export async function GET(request) {
  try {
    const members = getMembers();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }
    const member = createMember(body);
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}

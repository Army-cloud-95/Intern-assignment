import { NextResponse } from 'next/server';
import { getActivities } from '@/lib/db';

export async function GET(request) {
  try {
    const activities = getActivities(25);
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity log' }, { status: 500 });
  }
}

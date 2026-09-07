import { NextResponse } from 'next/server';
import { resetToSeedData } from '@/lib/db';

export async function POST(request) {
  try {
    const freshData = resetToSeedData();
    return NextResponse.json({ message: 'Database reset to default seed data successfully', store: freshData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset seed data' }, { status: 500 });
  }
}

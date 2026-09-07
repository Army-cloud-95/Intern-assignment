import { NextResponse } from 'next/server';
import { generateAiSuggestions } from '@/lib/db';

export async function POST(request) {
  try {
    const { promptType, contextData } = await request.json();
    const suggestions = generateAiSuggestions(promptType || 'task_breakdown', contextData);
    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json({ error: 'AI Copilot processing error' }, { status: 500 });
  }
}

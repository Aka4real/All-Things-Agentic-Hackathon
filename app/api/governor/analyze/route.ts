import { NextRequest, NextResponse } from 'next/server';
import { GovernorEngine } from '@/lib/governor';
import { GovernorProblemInput } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const input: GovernorProblemInput = await req.json();
    if (!input.title || !input.problem_description) {
      return NextResponse.json({ error: 'Missing title or problem_description' }, { status: 400 });
    }

    const result = await GovernorEngine.analyzeProblem(input);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown Governor analysis error';
    console.error('API /api/governor/analyze error:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

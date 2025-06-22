import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() : Promise<NextResponse> {

  try {
    await dbConnect();
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    console.log('Fetched tasks:', tasks);
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
    
  } finally {
    console.log('GET request completed');
  }
}

export async function POST(request: NextRequest)  : Promise<NextResponse> {
  try {
    const body = await request.json();
    await dbConnect();
    const task = await Task.create(body);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  } finally {
    console.log('POST request completed');
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;
    
    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    try {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      // Create user
      const user = await db.user.create({
        data: { email, name }
      });

      return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (dbError) {
      // Mock mode for development without database
      console.log('Database not available, using mock auth');
      const mockUser = {
        id: `mock-${Date.now()}`,
        email,
        name
      };
      return NextResponse.json({ user: mockUser });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
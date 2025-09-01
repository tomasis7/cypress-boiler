import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
      // Find user
      const user = await db.user.findUnique({
        where: { email }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (dbError) {
      // Mock mode for development without database
      console.log('Database not available, using mock login');
      const mockUser = {
        id: `mock-${Date.now()}`,
        email,
        name: email.split('@')[0] // Use email prefix as name
      };
      return NextResponse.json({ user: mockUser });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
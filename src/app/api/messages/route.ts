import { NextResponse } from 'next/server';
import prisma  from '../../../../lib/prisma';

// GET all messages
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET all messages
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
    });
    
    // Add CORS headers
    return new NextResponse(JSON.stringify(messages), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch messages' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// POST a new message
export async function POST(request: Request) {
  try {
    const { content, sender } = await request.json();

    if (!content || !sender) {
      return new NextResponse(JSON.stringify({ error: 'Content and sender are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const message = await prisma.message.create({
      data: {
        content,
        sender,
      },
    });

    // Add CORS headers
    return new NextResponse(JSON.stringify(message), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
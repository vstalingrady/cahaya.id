// src/app/api/ayo/v1/identity/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-api-db';

/**
 * Fetches identity information for a user associated with a given access_token.
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'unauthorized', error_description: 'Missing or invalid Bearer token' }, { status: 401 });
    }
    
    const accessToken = authHeader.split(' ')[1];
    const tokenInfo = db.getUserByAccessToken(accessToken);

    if (!tokenInfo) {
      return NextResponse.json({ error: 'unauthorized', error_description: 'Invalid or expired access token' }, { status: 403 });
    }

    // Find the user's identity from our mock database
    const user = db.users.find(u => u.user_id === tokenInfo.userId);

    if (!user) {
        return NextResponse.json({ error: 'not_found', error_description: 'User identity not found for this token.' }, { status: 404 });
    }

    return NextResponse.json({
      request_id: `req_id_${Date.now()}`,
      identity: user.identity,
    });

  } catch (error) {
    console.error('[/api/ayo/v1/identity] Error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}

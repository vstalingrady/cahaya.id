// src/app/api/ayo/v1/token/exchange/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-api-db';

/**
 * This endpoint simulates exchanging a short-lived public_token for a
 * long-lived access_token for a specific user.
 * This is a critical step in the user-facing authentication flow.
 */
export async function POST(request: Request) {
  try {
    // In a real scenario, we would also verify the app's own access token here
    // via the Authorization header. We'll skip that for simplicity in this mock.
    const { public_token } = await request.json();

    if (!public_token) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'public_token is required' },
        { status: 400 }
      );
    }

    const tokenInfo = db.exchangePublicToken(public_token);

    if (tokenInfo.error) {
      return NextResponse.json(
        { error: 'invalid_grant', error_description: 'The public token is invalid or expired' },
        { status: 403 }
      );
    }

    // Return the permanent access_token
    return NextResponse.json({
      access_token: tokenInfo.access_token,
      token_type: 'Bearer',
      user_id: tokenInfo.user_id, // Send back the user_id associated with this token
    });

  } catch (error) {
    console.error('[/api/ayo/v1/token/exchange] Error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}

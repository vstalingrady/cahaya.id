// src/app/api/ayo/v1/oauth2/token/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-api-db';

/**
 * This endpoint simulates the OAuth 2.0 Client Credentials Grant Flow.
 * A backend service (in this case, the Cuan app) would call this endpoint
 * with its client_id and client_secret to get an access token.
 * This token authorizes the Cuan app itself to perform actions on behalf of its users,
 * like initiating a new bank connection request.
 */
export async function POST(request: Request) {
  try {
    const { client_id, client_secret, grant_type } = await request.json();

    if (grant_type !== 'client_credentials') {
      return NextResponse.json(
        { error: 'unsupported_grant_type', error_description: 'Grant type must be client_credentials' },
        { status: 400 }
      );
    }

    if (!client_id || !client_secret) {
        return NextResponse.json(
            { error: 'invalid_client', error_description: 'Client ID and secret are required' },
            { status: 401 }
        );
    }

    // Authenticate the client (our Cuan app)
    const tokenInfo = db.getAppToken(client_id, client_secret);

    if (!tokenInfo) {
      return NextResponse.json(
        { error: 'invalid_client', error_description: 'Invalid client credentials' },
        { status: 401 }
      );
    }

    // Return the access token
    return NextResponse.json({
      access_token: tokenInfo.access_token,
      token_type: 'Bearer',
      expires_in: tokenInfo.expires_in,
    });

  } catch (error) {
    console.error('[/api/ayo/v1/oauth2/token] Error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}

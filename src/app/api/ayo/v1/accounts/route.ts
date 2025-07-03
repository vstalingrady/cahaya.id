// src/app/api/ayo/v1/accounts/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-api-db';

/**
 * Fetches a list of accounts associated with a given access_token.
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

    // Filter the main accounts table to get only the accounts for this user
    const userAccounts = db.accounts.filter(acc => tokenInfo.accounts.includes(acc.account_id));

    return NextResponse.json({
      request_id: `req_${Date.now()}`,
      accounts: userAccounts,
    });

  } catch (error) {
    console.error('[/api/ayo/v1/accounts] Error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}

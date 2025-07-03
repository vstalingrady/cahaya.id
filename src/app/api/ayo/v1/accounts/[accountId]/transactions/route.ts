// src/app/api/ayo/v1/accounts/[accountId]/transactions/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-api-db';
import { parseISO, isWithinInterval } from 'date-fns';

/**
 * Fetches transactions for a specific account_id.
 * Supports filtering by start_date and end_date.
 */
export async function GET(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date'); // YYYY-MM-DD
    const endDate = searchParams.get('end_date');   // YYYY-MM-DD

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'unauthorized', error_description: 'Missing or invalid Bearer token' }, { status: 401 });
    }
    
    const accessToken = authHeader.split(' ')[1];
    const tokenInfo = db.getUserByAccessToken(accessToken);

    if (!tokenInfo) {
      return NextResponse.json({ error: 'unauthorized', error_description: 'Invalid or expired access token' }, { status: 403 });
    }

    // Security Check: Ensure the requested accountId belongs to the user associated with the token
    if (!tokenInfo.accounts.includes(accountId)) {
        return NextResponse.json({ error: 'forbidden', error_description: 'This access token is not permitted to access the requested account.' }, { status: 403 });
    }

    let accountTransactions = db.transactions.filter(t => t.account_id === accountId);

    // Filter by date range if provided
    if (startDate && endDate) {
        const interval = { start: parseISO(startDate), end: parseISO(endDate) };
        accountTransactions = accountTransactions.filter(t => isWithinInterval(parseISO(t.date), interval));
    }

    return NextResponse.json({
      request_id: `req_txn_${Date.now()}`,
      transactions: accountTransactions,
    });

  } catch (error) {
    console.error(`[/api/ayo/v1/accounts/${params.accountId}/transactions] Error:`, error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}

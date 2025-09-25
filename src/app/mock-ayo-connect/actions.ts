'use server';

import { db } from '@/lib/mock-data';

export async function mockLogin(username: string, password: string) {
  // In our mock DB, we just have one user. We'll check against their credentials.
  const user = db.users[0];
  if (user.bank_login.username === username && user.bank_login.password_plaintext === password) {
    return { success: true, publicToken: 'good_public_token_for_budi' };
  } else {
    return { success: false, error: 'Invalid credentials. Please try again.' };
  }
}

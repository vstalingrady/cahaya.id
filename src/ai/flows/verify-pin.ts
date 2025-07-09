'use server';
/**
 * @fileOverview A Genkit flow to verify a user's security PIN.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as bcrypt from 'bcrypt';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const VerifyPinInputSchema = z.object({
  userId: z.string().describe("The user's unique ID."),
  pinAttempt: z.string().min(6).max(6).describe("The 6-character PIN attempt."),
});

const VerifyPinOutputSchema = z.object({
  success: z.boolean(),
  reason: z.string().optional(),
});

export async function verifyPin(input: z.infer<typeof VerifyPinInputSchema>): Promise<z.infer<typeof VerifyPinOutputSchema>> {
    return verifyPinFlow(input);
}

export const verifyPinFlow = ai.defineFlow(
  {
    name: 'verifyPinFlow',
    inputSchema: VerifyPinInputSchema,
    outputSchema: VerifyPinOutputSchema,
  },
  async ({ userId, pinAttempt }) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return { success: false, reason: "User not found." };
        }
        
        const userData = userSnap.data();
        const hashedPin = userData.hashedPin;

        if (!hashedPin) {
            return { success: false, reason: "No PIN is set for this account." };
        }
        
        const match = await bcrypt.compare(pinAttempt, hashedPin);
        
        return { success: match, reason: match ? undefined : "The PIN you entered is incorrect." };

    } catch (error) {
        console.error("Error in verifyPinFlow: ", error);
        return { success: false, reason: "An unexpected server error occurred." };
    }
  }
);

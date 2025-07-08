
import { defineFlow, runFlow } from '@genkit-ai/flow';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';

// This would be your hashed PIN stored securely in a database or secret manager
const HASHED_PIN = '$2b$10$inJ5hgx5JdLbXK3YHM0qVer8QDtkX63eBi.YacKgT4LoTtPgA2WmK';

export const verifyPinFlow = defineFlow(
  {
    name: 'verifyPinFlow',
    inputSchema: z.object({ pin: z.string() }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ pin }) => {
    const match = await bcrypt.compare(pin, HASHED_PIN);
    return { success: match };
  }
);

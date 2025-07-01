'use server';
/**
 * @fileOverview A tool for finding local financial promotions.
 *
 * - findFinancialPromos - A Genkit tool that finds deals based on location.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const findFinancialPromos = ai.defineTool(
  {
    name: 'findFinancialPromos',
    description: 'Finds local financial promotions and deals for a user based on their location.',
    inputSchema: z.object({
      location: z.string().describe('The city or area to search for promotions in, e.g., "Jakarta"'),
    }),
    outputSchema: z.array(z.object({
      provider: z.string().describe("The provider of the deal, e.g., 'OVO', 'GoPay'"),
      deal: z.string().describe("A description of the promotion."),
    })),
  },
  async ({location}) => {
    console.log(`Searching for promos in: ${location}`);
    // In a real app, this would call an external API.
    // For this prototype, we return hardcoded sample data.
    if (location.toLowerCase().includes('jakarta')) {
      return [
        {
          provider: 'OVO',
          deal: '50% cashback on coffee at Kopi Kenangan, up to IDR 10,000.',
        },
        {
          provider: 'GoPay',
          deal: 'Save IDR 20,000 on your next GoRide trip when paying with GoPay.',
        },
        {
          provider: 'BCA',
          deal: 'Buy 1 Get 1 movie ticket at Cinema XXI every Saturday with a BCA credit card.',
        },
      ];
    }
    return [];
  }
);

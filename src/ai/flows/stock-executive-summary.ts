'use server';

/**
 * @fileOverview Provides an AI-generated executive summary of a stock based on its ticker symbol.
 *
 * - `getStockExecutiveSummary` -  A function that takes a stock ticker as input and returns an executive summary.
 * - `StockExecutiveSummaryInput` - The input type for the `getStockExecutiveSummary` function.
 * - `StockExecutiveSummaryOutput` - The return type for the `getStockExecutiveSummary` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StockExecutiveSummaryInputSchema = z.object({
  ticker: z.string().describe('The stock ticker symbol.'),
});
export type StockExecutiveSummaryInput = z.infer<typeof StockExecutiveSummaryInputSchema>;

const StockExecutiveSummaryOutputSchema = z.object({
  summary: z.string().describe('An executive summary of the stock.'),
});
export type StockExecutiveSummaryOutput = z.infer<typeof StockExecutiveSummaryOutputSchema>;

export async function getStockExecutiveSummary(
  input: StockExecutiveSummaryInput
): Promise<StockExecutiveSummaryOutput> {
  return stockExecutiveSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'stockExecutiveSummaryPrompt',
  input: {schema: StockExecutiveSummaryInputSchema},
  output: {schema: StockExecutiveSummaryOutputSchema},
  prompt: `You are a financial analyst providing a summary of a company given its stock ticker.

  Provide a concise executive summary for the following stock ticker: {{{ticker}}}. Focus on key aspects such as recent performance, industry, and any significant news.
  `,
});

const stockExecutiveSummaryFlow = ai.defineFlow(
  {
    name: 'stockExecutiveSummaryFlow',
    inputSchema: StockExecutiveSummaryInputSchema,
    outputSchema: StockExecutiveSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

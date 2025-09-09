
"use server";
import { getStockExecutiveSummary } from "@/ai/flows/stock-executive-summary";

export async function generateStockSummary(ticker: string): Promise<{ summary: string | null; error: string | null; }> {
  if (!ticker || typeof ticker !== "string" || ticker.length === 0 || ticker.length > 5) {
    return { summary: null, error: "Please enter a valid stock ticker." };
  }

  try {
    const result = await getStockExecutiveSummary({ ticker });
    if (result && result.summary) {
        return { summary: result.summary, error: null };
    }
    return { summary: null, error: "Could not retrieve a summary for this ticker." };
  } catch (error) {
    console.error(error);
    return { summary: null, error: "An error occurred while generating the summary." };
  }
}

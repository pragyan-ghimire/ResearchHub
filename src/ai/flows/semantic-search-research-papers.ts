'use server';
/**
 * @fileOverview This file implements a Genkit flow for semantic search of research papers.
 *
 * - semanticSearch - A function that performs semantic search on research papers.
 * - SemanticSearchInput - The input type for the semanticSearch function, which is a string query.
 * - SemanticSearchOutput - The return type for the semanticSearch function, which is a list of research paper titles.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticSearchInputSchema = z.string().describe('The search query.');
export type SemanticSearchInput = z.infer<typeof SemanticSearchInputSchema>;

const SemanticSearchOutputSchema = z.array(z.string()).describe('A list of research paper titles.');
export type SemanticSearchOutput = z.infer<typeof SemanticSearchOutputSchema>;

export async function semanticSearch(query: SemanticSearchInput): Promise<SemanticSearchOutput> {
  return semanticSearchFlow(query);
}

const semanticSearchPrompt = ai.definePrompt({
  name: 'semanticSearchPrompt',
  input: {schema: SemanticSearchInputSchema},
  output: {schema: SemanticSearchOutputSchema},
  prompt: `You are an expert research assistant tasked with finding relevant research papers based on a user's query.\n  Given the following query, identify a list of research paper titles that are semantically similar or related to the query.\n  Return only the titles of the papers. Do not include any additional information or context.\n\n  Query: {{{$input}}}`, // Changed input to {{$input}} to use the whole query string directly
});

const semanticSearchFlow = ai.defineFlow(
  {
    name: 'semanticSearchFlow',
    inputSchema: SemanticSearchInputSchema,
    outputSchema: SemanticSearchOutputSchema,
  },
  async query => {
    const {output} = await semanticSearchPrompt(query);
    return output!;
  }
);

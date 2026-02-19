import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using
    natural language.
    You have access to following tools:
    1. schema tool call this tool to get the database schema which will help you to write sql query.
    
    Rules:
    - Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)
   
    - Return valid SQLite syntax
    
    Always respond in a helpful, conversational tone while being technically accurate. `;

  const result = streamText({
    model: openrouter("openai/gpt-oss-120b:free"),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    tools: {
      db: tool({
        description: "Call this tool to query the database",
        inputSchema: z.object({
          query: z
            .string()
            .describe("The SQL query to be ran"),
        }),
        execute: async ({ query }) => {
          console.log("Executing SQL query:", query);
          return query;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}

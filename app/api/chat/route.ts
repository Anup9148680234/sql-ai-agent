import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
  createUIMessageStreamResponse,
} from "ai";

import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { db } from "@/db/db";

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using
    natural language.
    You have access to following tools:
    1. db tool to run SQL queries against the database. Use this tool to answer user's question.
    
    The database schema is:

    CREATE TABLE products (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      name text NOT NULL,
      category text NOT NULL,
      price real NOT NULL,
      stock integer DEFAULT 0 NOT NULL,
      created_at text DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE sales (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      product_id integer NOT NULL,
      quantity integer NOT NULL,
      total_amount real NOT NULL,
      sale_date text DEFAULT CURRENT_TIMESTAMP,
      customer_name text NOT NULL,
      region text NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    Always generate ONLY SELECT queries based on the user's question.

    Always respond in a helpful, conversational tone while being technically accurate. `;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openrouter("openai/gpt-oss-120b:free"),
      messages: await convertToModelMessages(messages),
      system: SYSTEM_PROMPT,
      stopWhen: stepCountIs(5),
      tools: {
        db: tool({
          description: "Call this tool to query the database",
          inputSchema: z.object({
            query: z.string().describe("The SQL query to be ran"),
          }),
          execute: async ({ query }) => {
            try {
              const result = await db.run(query);

              if (!result.rows || result.rows.length === 0) {
                return "No results found.";
              }

              return result.rows
                .map((row: Record<string, any>) =>
                  Object.entries(row)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", "),
                )
                .join("\n");
            } catch (error: any) {
              console.error("DB ERROR:", error);

              return `❌ Database Error: ${error.message ?? "Unknown error occurred."}`;
            }
          },
        }),
        schema: tool({
          description: "Call this tool to get the database schema",
          inputSchema: z.object({}),
          execute: async () => {
            return `CREATE TABLE products (
                id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                name text NOT NULL,
                category text NOT NULL,
                price real NOT NULL,
                stock integer DEFAULT 0 NOT NULL,
                created_at text DEFAULT CURRENT_TIMESTAMP
              )
             
              CREATE TABLE sales (
                id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_id integer NOT NULL,
                quantity integer NOT NULL,
                total_amount real NOT NULL,
                sale_date text DEFAULT CURRENT_TIMESTAMP,
                customer_name text NOT NULL,
                region text NOT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
              )
              `;
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("MODEL ERROR:", error);

    throw new Error("Test error");

    // Detect rate limit
    const isRateLimit =
      error?.status === 429 || error?.message?.toLowerCase().includes("rate");

    const message = isRateLimit
      ? "⚠️ You are being rate limited. Please wait a few seconds and try again."
      : `❌ Unexpected error: ${error?.message ?? "Something went wrong."}`;

    // Return a proper error response
    return new Response(
      JSON.stringify({
        role: "assistant",
        content: message,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

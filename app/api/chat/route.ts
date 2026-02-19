import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openrouter("openai/gpt-oss-120b:free"), 
    // example models:
    // "openai/gpt-4o"
    // "anthropic/claude-3.5-sonnet"
    // "meta-llama/llama-3.1-70b-instruct"
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
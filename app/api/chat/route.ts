import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-5.2-codex"),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
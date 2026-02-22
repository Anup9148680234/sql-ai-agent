"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

type AIInput = {
  query: string;
};

type AIOutputput = {
  rows: string[];
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [timestamps, setTimestamps] = useState<Record<string, string>>({});

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Attach timestamp once per message + auto scroll
  useEffect(() => {
    if (!mounted) return;

    setTimestamps((prev) => {
      const updated = { ...prev };

      messages.forEach((msg) => {
        if (!updated[msg.id]) {
          updated[msg.id] = formatTime(new Date());
        }
      });

      return updated;
    });

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mounted]);

  return (
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <div className="w-full max-w-3xl flex flex-col h-full">
        {/* Header */}
        <div className="relative border-b border-zinc-200/70 dark:border-zinc-800/70 backdrop-blur-sm bg-white/70 dark:bg-zinc-950/70">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-800 to-green-800 flex items-center justify-center text-white font-bold shadow-md">
                <svg
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                    width="22px"    
                 
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    <title>{"file_type_sql"}</title>
                    <path
                      d="M8.562,15.256A21.159,21.159,0,0,0,16,16.449a21.159,21.159,0,0,0,7.438-1.194c1.864-.727,2.525-1.535,2.525-2V9.7a10.357,10.357,0,0,1-2.084,1.076A22.293,22.293,0,0,1,16,12.078a22.36,22.36,0,0,1-7.879-1.3A10.28,10.28,0,0,1,6.037,9.7v3.55C6.037,13.724,6.7,14.528,8.562,15.256Z"
                      style={{
                        fill: "#42ff8b",
                      }}
                    />
                    <path
                      d="M8.562,21.961a15.611,15.611,0,0,0,2.6.741A24.9,24.9,0,0,0,16,23.155a24.9,24.9,0,0,0,4.838-.452,15.614,15.614,0,0,0,2.6-.741c1.864-.727,2.525-1.535,2.525-2v-3.39a10.706,10.706,0,0,1-1.692.825A23.49,23.49,0,0,1,16,18.74a23.49,23.49,0,0,1-8.271-1.348,10.829,10.829,0,0,1-1.692-.825V19.96C6.037,20.426,6.7,21.231,8.562,21.961Z"
                      style={{
                        fill: "#42ff8b",
                      }}
                    />
                    <path
                      d="M16,30c5.5,0,9.963-1.744,9.963-3.894V23.269a10.5,10.5,0,0,1-1.535.762l-.157.063A23.487,23.487,0,0,1,16,25.445a23.422,23.422,0,0,1-8.271-1.351c-.054-.02-.106-.043-.157-.063a10.5,10.5,0,0,1-1.535-.762v2.837C6.037,28.256,10.5,30,16,30Z"
                      style={{
                        fill: "#42ff8b",
                      }}
                    />
                    <ellipse
                      cx={16}
                      cy={5.894}
                      rx={9.963}
                      ry={3.894}
                      style={{
                        fill: "#42ff8b",
                      }}
                    />
                  </g>
                </svg>
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-lg md:text-xl font-semibold bg-gradient-to-r from-cyan-600 to-green-300 bg-clip-text text-transparent">
                  SQL AI AGENT
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Intelligent Database Assistant
                </span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* Bubble */}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                  message.role === "user"
                    ? "bg-black text-white dark:bg-white dark:text-black rounded-br-md"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-bl-md"
                }`}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="whitespace-pre-wrap"
                        >
                          {part.text}
                        </div>
                      );

                    case "tool-db":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-xs"
                        >
                          <div className="font-semibold mb-1">
                            🔍 Database Query
                          </div>

                          {(part.input as unknown as AIInput)?.query && (
                            <pre className="bg-white dark:bg-zinc-950 p-2 rounded overflow-x-auto text-xs">
                              {(part.input as unknown as AIInput).query}
                            </pre>
                          )}

                          {part.state === "output-available" && (
                            <pre className="bg-white dark:bg-zinc-950 p-2 rounded overflow-x-auto mt-2 text-xs">
                              {JSON.stringify(part.output, null, 2)}
                            </pre>
                          )}
                        </div>
                      );

                    case "tool-schema":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 text-xs"
                        >
                          <div className="font-semibold">📋 Schema Tool</div>
                          {part.state === "output-available" && (
                            <div className="mt-1 text-green-600 dark:text-green-400">
                              ✅ Schema loaded
                            </div>
                          )}
                        </div>
                      );

                   

                    default:
                      return null;
                  }
                })}
              </div>

              {/* Timestamp */}
              {mounted && (
                <div className="text-[10px] mt-1 text-zinc-400 px-1">
                  {timestamps[message.id]}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm animate-pulse">
                Fetching...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            sendMessage({ text: input });
            setInput("");
          }}
          className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-950"
        >
          <div className="flex gap-2">
            <input
              className="flex-1 p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              value={input}
              placeholder="Ask about your database..."
              onChange={(e) => setInput(e.currentTarget.value)}
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

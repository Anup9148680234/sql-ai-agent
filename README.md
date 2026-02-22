# 🧠 SQL AI Assistant

An AI-powered SQL assistant built with **Next.js**, **Vercel AI SDK**, **Drizzle ORM**, and **Turso (LibSQL)**.

Ask natural language questions about your database and get real-time, AI-generated SQL results — safely restricted to `SELECT` queries only.

---

## 🚀 Overview

SQL AI Assistant allows users to:

- 💬 Ask questions in natural language
- 🤖 Automatically generate SQL queries using LLMs
- 🗄 Execute queries securely against a Turso cloud database
- 📡 Stream responses in real-time
- ❌ Handle rate limits and database errors gracefully
- 🎨 Interact via a modern SaaS-style chat interface

---

## 🏗 Tech Stack

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **TailwindCSS**
- **Vercel AI SDK (`ai`)**

### Backend / AI
- **OpenRouter (LLM provider)**
- **Streaming responses**
- **Tool calling (db + schema tools)**

### Database
- **Turso (LibSQL cloud database)**
- **Drizzle ORM**
- **SQLite-compatible schema**

---

## 🗂 Database Schema

```sql
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
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenRouter (LLM)
OPENROUTER_API_KEY=your_openrouter_api_key

# Turso Database
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

These credentials are required to connect securely to your Turso cloud database.

---

## 🧪 Local Development

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 🧠 How It Works

1. User sends a natural language query
2. AI generates a safe `SELECT` SQL statement
3. `db` tool executes the query via Drizzle + Turso
4. Results are formatted
5. Response streams back in real-time to the UI

---

## 🔐 Security Design

- Only `SELECT` queries are allowed
- No `INSERT`, `UPDATE`, `DELETE`, or `DROP`
- SQL execution wrapped in try/catch
- Model rate-limit handling
- Errors returned in structured chat format
- No raw credentials exposed client-side

---

## 🎨 UI Features

- ChatGPT-style conversation layout
- Timestamped messages
- Tool execution preview blocks
- Graceful rate-limit messaging
- Smooth auto-scroll
- Dark mode support

---

## 📂 Project Structure

```
/app
  /api/chat/route.ts     → AI + tool logic
  /sql-ai/page.tsx       → Chat UI

/db
  db.ts                  → Drizzle + Turso connection

/drizzle
  schema.ts              → Database schema definitions
```

---

## 🛠 Error Handling

The system gracefully handles:

- Turso connection errors
- Invalid SQL generation
- Model rate limits (429)
- Streaming interruptions
- Unexpected runtime failures

Errors are returned as assistant messages for a seamless UX.

---




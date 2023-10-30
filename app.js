import { serve } from "https://deno.land/std/http/server.ts"; // Updated import for serve
import { Hono } from "https://deno.land/x/hono@v3.7.4/mod.ts";

const app = new Hono();
const server = serve({ port: 7777 }); // Create a server instance

async function getFeedback(key) {
  const kv = await Deno.openKv();
  const count = await kv.get(key); // Change to kv.get(key)
  return count ? parseInt(count) : 0; // Use count directly
}

async function incrementFeedback(key) {
  const kv = await Deno.openKv();
  const currentCount = await getFeedback(key); // Fix the function name
  await kv.set(key, (currentCount + 1).toString()); // Use key and stringify the value
}

app.get("/feedbacks/1", async (c) => {
  const count = await getFeedback("1"); // Pass the key as a string
  return c.text(`Feedback 1: ${count}`);
});

app.post("/feedbacks/1", async (c) => {
  await incrementFeedback("1");
  return c.text("Feedback 1 incremented");
});

app.get("/feedbacks/2", async (c) => {
  const count = await getFeedback("2");
  return c.text(`Feedback 2: ${count}`);
});

app.post("/feedbacks/2", async (c) => {
  await incrementFeedback("2");
  return c.text("Feedback 2 incremented");
});

app.get("/feedbacks/3", async (c) => {
  const count = await getFeedback("3");
  return c.text(`Feedback 3: ${count}`);
});

app.post("/feedbacks/3", async (c) => {
  await incrementFeedback("3");
  return c.text("Feedback 3 incremented");
});

for await (const req of server) {
  app.handleRequest(req);
}

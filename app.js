import { serve } from "./deps.js";
import { Hono } from "https://deno.land/x/hono@v3.7.4/mod.ts";

const app = new Hono();

async function getFeedback(key) {
    const kv = await Deno.openKv();
    const count = await kv.get([key]);
    return count.value ? parseInt(count.value) : 0;
}

async function incrementFeedback(key) {
    const kv = await Deno.openKv();
    const currentCount = await getFeedback(key);
    await kv.set([key], (currentCount + 1));
}

app.get("/feedbacks/1", async (c) => {
  const kv = await Deno.openKv();
  await getFeedback("1");
  return c.text(`Feedback 1: ${count}`);
});

app.post("/feedbacks/1", async (c) => {
    await incrementFeedback("1");
    return c.text("Feedback 1 incremented");
});

app.get("/feedbacks/2", async (c) => {
  const kv = await Deno.openKv();
  await getFeedback("2");
  return c.text(`Feedback 2: ${count}`);
});

app.post("/feedbacks/2", async (c) => {
  await incrementFeedback("2");
    return c.text("Feedback 2 incremented");
});

app.get("/feedbacks/3", async (c) => {
  const kv = await Deno.openKv();
  await getFeedback("3");
  return c.text(`Feedback 3: ${count}`);
});

app.post("/feedbacks/3", async (c) => {
  await incrementFeedback("3");
    return c.text("Feedback 3 incremented");
});

serve(app.fetch, { port: 7777 });

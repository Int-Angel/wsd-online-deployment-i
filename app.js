import { Hono } from "https://deno.land/x/hono@v3.7.4/mod.ts";
import { openKv, get, set } from "https://deno.land/std/kv/mod.ts";

const app = new Hono();
const kv = await openKv();

// Define the feedback endpoints for values 1, 2, and 3.
for (let feedbackValue = 1; feedbackValue <= 3; feedbackValue++) {
  // Define the GET endpoint to retrieve the count for a specific feedback value.
  app.get(`/feedbacks/${feedbackValue}`, async (c) => {
    const count = await get(kv, `Feedback ${feedbackValue}`);
    return c.text(`Feedback ${feedbackValue}: ${count || 0}`);
  });

  // Define the POST endpoint to increment the count for a specific feedback value.
  app.post(`/feedbacks/${feedbackValue}`, async (c) => {
    const currentCount = await get(kv, `Feedback ${feedbackValue}`);
    const newCount = (parseInt(currentCount) || 0) + 1;
    await set(kv, `Feedback ${feedbackValue}`, newCount.toString());
    return c.text(`Feedback ${feedbackValue} incremented to ${newCount}`);
  });
}

export default app;

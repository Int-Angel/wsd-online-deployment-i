// deno run --allow-net --unstable --watch app.js
import { serve } from "https://deno.land/std/http/server.ts"; // Updated import for serve
import { Hono } from "https://deno.land/x/hono@v3.7.4/mod.ts";
import * as coursesController from "./coursesController.js";

const app = new Hono();

async function getFeedback(key) {
  const kv = await Deno.openKv();
  const count = await kv.get([key]);
  return count.value ? parseInt(count.value) : 0;
}

async function incrementFeedback(key) {
  const kv = await Deno.openKv();
  const currentCount = await getFeedback(key);
  await kv.set([key], currentCount + 1);
}

app.get("/", async (c) => {
  return c.html(`
        <h1>How would you rate this experience?</h1>
        <form action="/feedbacks/1" method="post">
        <button>Poor</button>
        </form>
        <form action="/feedbacks/2" method="post">
        <button>Fair</button>
        </form>
        <form action="/feedbacks/3" method="post">
        <button>Good</button>
        </form>
        <form action="/feedbacks/4" method="post">
        <button>Very good</button>
        </form>
        <form action="/feedbacks/5" method="post">
        <button>Excellent</button>
        </form>
    `);
});

app.get("/feedbacks/:id", async (c) => {
  const num = c.req.param("id");
  const count = await getFeedback(num); // Pass the key as a string
  return c.text(`Feedback ${num}: ${count}`);
});

app.post("/feedbacks/:id", async (c) => {
  const num = c.req.param("id");
  await incrementFeedback(num);
  return c.redirect("/");
});

app.get("/courses", coursesController.showForm);
app.post("/courses", coursesController.createCourse);
app.get("/courses/:courseId", coursesController.showCourse);
app.post("/courses/:courseId", coursesController.updateCourse);
app.post("/courses/:courseId/delete", coursesController.deleteCourse);

serve(app.fetch, { port: 7777 });

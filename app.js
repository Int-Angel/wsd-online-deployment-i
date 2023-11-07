// deno run --allow-net --unstable --watch app.js
import { serve } from "https://deno.land/std/http/server.ts"; // Updated import for serve
import { Hono } from "https://deno.land/x/hono@v3.7.4/mod.ts";
import * as coursesController from "./coursesController.js";

const app = new Hono();

app.get("/courses", coursesController.showForm);
app.post("/courses", coursesController.createCourse);
app.get("/courses/:courseId", coursesController.showCourse);
app.post("/courses/:courseId", coursesController.updateCourse);
app.post("/courses/:courseId/delete", coursesController.deleteCourse);
app.get("/courses/:courseId/feedbacks/:id", coursesController.getFeedback);
app.post(
  "/courses/:courseId/feedbacks/:id",
  coursesController.incrementFeedback,
);

serve(app.fetch, { port: 7777 });

import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import * as coursesService from "./coursesService.js";
import {
  getSignedCookie,
  setSignedCookie,
} from "https://deno.land/x/hono@v3.7.4/helper.ts";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });
const sessionFeedback = new Set();
const secret = "secret";

const generateKey = (sessionId, courseId) => {
  return `${sessionId}-${courseId}`;
};

const submitFeedbackCourse = (sessionId, courseId) => {
  const key = generateKey(sessionId, courseId);
  sessionFeedback.add(key);
};

const canSessionSubmitFeedback = (sessionId, courseId) => {
  const key = generateKey(sessionId, courseId);
  return !sessionFeedback.has(key);
};

const validator = z.object({
  course: z.string().min(4, {
    message: "The course name should be a string of at least 4 characters.",
  }),
});

const showForm = async (c) => {
  return c.html(
    eta.render("courses.eta", { courses: await coursesService.listCourses() }),
  );
};

const createCourse = async (c) => {
  const body = await c.req.parseBody();
  const validationResult = validator.safeParse(body);

  if (!validationResult.success) {
    return c.html(
      eta.render("courses.eta", {
        courses: await coursesService.listCourses(),
        course: {
          ...body,
          errors: validationResult.error.format(),
        },
      }),
    );
  }

  await coursesService.createCourse(body);
  return c.redirect("/courses");
};

const showCourse = async (c) => {
  const id = c.req.param("courseId");

  const sessionId =
    (await getSignedCookie(c, secret, "sessionId")) ?? crypto.randomUUID();

  if (!canSessionSubmitFeedback(sessionId, id)) {
    return c.text(
      "You have already given feedback for this course. Thank you!",
    );
  }

  return c.html(
    eta.render("course.eta", { course: await coursesService.getCourse(id) }),
  );
};

const updateCourse = async (c) => {
  const id = c.req.param("courseId");
  const body = await c.req.parseBody();
  await coursesService.updateCourse(id, body);
  return c.redirect(`/courses/${id}`);
};

const deleteCourse = async (c) => {
  const id = c.req.param("courseId");
  await coursesService.deleteCourse(id);
  return c.redirect("/courses");
};

const getFeedback = async (c) => {
  const key = c.req.param("id");
  const courseId = c.req.param("courseId");

  const count = await coursesService.getFeedback(key, courseId);
  return c.text(`Feedback ${key}: ${count}`);
};

const incrementFeedback = async (c) => {
  const key = c.req.param("id");
  const courseId = c.req.param("courseId");

  const sessionId =
    (await getSignedCookie(c, secret, "sessionId")) ?? crypto.randomUUID();

  await setSignedCookie(c, "sessionId", sessionId, secret, {
    path: `/courses/${courseId}`,
  });

  if (!canSessionSubmitFeedback(sessionId, courseId)) {
    return c.redirect(`/courses/${courseId}`);
  }

  submitFeedbackCourse(sessionId, courseId);
  await coursesService.incrementFeedback(key, courseId);
  return c.redirect(`/courses/${courseId}`);
};

export {
  createCourse,
  showForm,
  showCourse,
  updateCourse,
  deleteCourse,
  getFeedback,
  incrementFeedback,
};

import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import * as coursesService from "./coursesService.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

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
  return c.html(
    eta.render("course.eta", { course: await coursesService.getCourse(id) }),
  );
  //const course = await coursesService.getCourse(id);
  //return c.text(course.course);
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

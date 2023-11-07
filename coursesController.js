import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";
import * as coursesService from "./coursesService.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showForm = async (c) => {
  return c.html(
    eta.render("courses.eta", { courses: await coursesService.listCourses() }),
  );
};

const createCourse = async (c) => {
  const body = await c.req.parseBody();
  await coursesService.createCourse(body);
  return c.redirect("/courses");
};

const showCourse = async (c) => {
  const id = c.req.param("courseId");
  /*
  return c.html(
    eta.render("course.eta", { course: await coursesService.getCourse(id) }),
  );
  */
  const course = await coursesService.getCourse(id);
  return c.text(course.course);
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

export { createCourse, showForm, showCourse, updateCourse, deleteCourse };

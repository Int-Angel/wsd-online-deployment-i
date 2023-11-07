const createCourse = async (course) => {
  course.id = crypto.randomUUID();

  const kv = await Deno.openKv();
  await kv.set(["courses", course.id], course);
};

const listCourses = async () => {
  const kv = await Deno.openKv();
  const entries = await kv.list({ prefix: ["courses"] });

  const courses = [];
  for await (const entry of entries) {
    courses.push(entry.value);
  }

  return courses;
};

const getCourse = async (id) => {
  const kv = await Deno.openKv();
  const course = await kv.get(["courses", id]);
  return course?.value ?? {};
};

const updateCourse = async (id, course) => {
  course.id = id;
  const kv = await Deno.openKv();
  await kv.set(["courses", id], course);
};

const deleteCourse = async (id) => {
  const kv = await Deno.openKv();
  await kv.delete(["courses", id]);
};

async function getFeedback(key, courseId) {
  const kv = await Deno.openKv();
  const count = await kv.get(["feedback", courseId, key]);
  return count.value ? parseInt(count.value) : 0;
}

async function incrementFeedback(key, courseId) {
  const kv = await Deno.openKv();
  const currentCount = await getFeedback(key, courseId);
  await kv.set(["feedback", courseId, key], currentCount + 1);
}

export {
  createCourse,
  listCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getFeedback,
  incrementFeedback,
};

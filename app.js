import { serve } from "./deps.js";

const handleRequest = (request) => {
  return new Response(
    "Hi there!",
  );
};

serve(handleRequest, { port: 7777 });

import { serve } from "./deps.js";

const handleRequest = (request) => {
  return new Response(
    "Hi again",
  );
};

serve(handleRequest, { port: 7777 });

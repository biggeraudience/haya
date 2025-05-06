import serverless from "serverless-http";
import createApp from "../haya-backend/server.js";

let handler = null;

export default {
  async fetch(request, env, ctx) {
    if (!handler) {
      // Pass the Worker env so your Express app can read env.CLOUDINARY_URL, etc.
      const app = createApp(env);
      handler = serverless(app);
    }
    return await handler(request, { event: request, context: ctx });
  },
};

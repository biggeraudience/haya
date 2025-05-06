import serverless from "serverless-http";
import createApp from "./server.js";

let handler = null;

export default {
  async fetch(request, env, ctx) {
    if (!handler) {
      // Pass the Worker env so your Express app can read env.MONGODB_URI, env.CLOUDINARY_*, etc.
      const app = createApp(env);
      handler = serverless(app);
    }
    // serverless-http expects (event, context)
    return handler(request, { event: request, context: ctx });
  },
};

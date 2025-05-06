import serverless from "serverless-http";
// worker.js lives under /api, so go up one level into haya-backend
import createApp from "../haya-backend/server.js";

let handlerPromise = null;

export default {
  async fetch(request, env, ctx) {
    if (!handlerPromise) {
      handlerPromise = (async () => {
        // createApp reads all env vars (incl. CLOUDINARY_*, MONGODB_URI, etc.)
        const app = createApp(env);
        return serverless(app);
      })();
    }
    const handler = await handlerPromise;
    // serverless-http expects signature (event, context)
    return handler(request, { event: request, context: ctx });
  },
};

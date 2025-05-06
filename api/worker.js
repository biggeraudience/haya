// api/worker.js
import serverless from "serverless-http";
// worker.js lives in /api, so go up to pick up your Express factory
import createApp from "../haya-backend/server.js";

let handlerPromise = null;

export default {
  async fetch(request, env, ctx) {
    if (!handlerPromise) {
      handlerPromise = (async () => {
        // initialize your Express app with the Worker env
        const app = createApp(env);
        return serverless(app);
      })();
    }
    const handler = await handlerPromise;
    // serverless-http expects (event, context)
    return handler(request, { event: request, context: ctx });
  },
};

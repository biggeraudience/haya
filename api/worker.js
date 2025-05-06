import serverless from "serverless-http";
// since worker.js now lives under /api, go up one level:
import createApp from "../haya-backend/server.js";

let handlerPromise = null;

export default {
  async fetch(request, env, ctx) {
    if (!handlerPromise) {
      handlerPromise = (async () => {
        const app = createApp(env);
        return serverless(app);
      })();
    }
    const handler = await handlerPromise;
    return handler(request, { event: request, context: ctx });
  },
};

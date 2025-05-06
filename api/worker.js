import serverless from "serverless-http";
// from api/worker.js up one level into haya-backend/
import createApp from "../haya-backend/server.js";

let handlerPromise = null;

export default {
  async fetch(request, env, ctx) {
    if (!handlerPromise) {
      // instantiate your Express app exactly once
      handlerPromise = (async () => {
        const app = createApp(env);
        return serverless(app);
      })();
    }
    const handler = await handlerPromise;
    return handler(request, { event: request, context: ctx });
  },
};

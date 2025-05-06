import serverless from "serverless-http";
import createApp  from "./haya-backend/server.js";

let handlerPromise = null;

export default {
  async fetch(request, env, ctx) {
    if (!handlerPromise) {
      // build your app only once, asynchronously
      handlerPromise = (async () => {
        const app = await createApp(env);
        return serverless(app);
      })();
    }
    const handler = await handlerPromise;
    return handler(request, { event: request, context: ctx });
  },
};

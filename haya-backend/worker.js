import serverless from "serverless-http";
import createApp   from "./server.js";   // ← now relative

let handler = null;

export default {
  async fetch(request, env, ctx) {
    if (!handler) {
      handler = serverless(createApp(env));
    }
    return handler(request, { event: request, context: ctx });
  },
};

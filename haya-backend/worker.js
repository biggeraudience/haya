// api/worker.js

import serverless from "serverless-http";
import createApp from "./server.js";

let handler = null;

export default {
  async fetch(request, env, ctx) {
    if (!handler) {
      // Initialize your Express app with Cloudflare Worker env
      const app = createApp(env);
      handler = serverless(app);
    }
    // serverless-http expects (event, context)
    return handler(request, { event: request, context: ctx });
  },
};

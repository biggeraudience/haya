// api/worker.js

import serverless from "serverless-http";
import createApp from "../haya-backend/server.js";

let handler = null;

export default {
  async fetch(request, env, ctx) {
    if (!handler) {
      // Initialize your Express app with Cloudflare Worker env
      const app = createApp(env);
      handler = serverless(app);
    }

    // serverless-http wants (event, context)
    return handler(request, { event: request, context: ctx });
  },
};

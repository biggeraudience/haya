// ../api/server.js

import serverless from "serverless-http";

import createApp from "../haya-backend/server.js";


let handler = null;

export default {
  async fetch(request, env, ctx) {
    
    if (!handler) {
     
      const app = createApp(env); // Pass the Cloudflare Worker's env object

      handler = serverless(app);
    }
    const response = await handler(request, { env, ctx });

    return response;
  },
};

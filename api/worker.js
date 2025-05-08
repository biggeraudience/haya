// api/worker.js

import serverless from "serverless-http";
import createApp from "../haya-backend/server.js"; 

let handler; 

export default {// ~/api/worker.js
import serverless from "serverless-http";
import createApp from "../haya-backend/server.js";

let handler;

export default {
  async fetch(request, env, ctx) {
    if (!handler) {
      const app = createApp(env);
      handler = serverless(app);
    }
    return handler(request, { event: request, context: ctx });
  },
};

    async fetch(request, env, ctx) {
       
        if (!handler) {
           
            const app = await createApp(env);
            handler = serverless(app);
        }
      
        return handler(request, { event: request, context: ctx });
    },
};

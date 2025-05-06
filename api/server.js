// ../api/server.js

import serverless from "serverless-http";

import app from "../haya-backend/server.js";


const handler = serverless(app);

export default {
  async fetch(request, env, ctx) {
    const response = await handler(request);
    return response;
  },
};

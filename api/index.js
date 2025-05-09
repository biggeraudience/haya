// api/index.js
import serverless from "serverless-http";      
import createApp   from "../haya-backend/server.js";

let handler;

export default async function (req, res) {
  if (!handler) {
    const app = await createApp(process.env);
    handler  = serverless(app);
  }
  return handler(req, res);
}

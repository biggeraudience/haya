import createApp from "../haya-backend/server.js";
let app; 
export default async function handler(req, res) {
  if (!app) {
    app = await createApp(process.env);
  }
  return app(req, res);
}

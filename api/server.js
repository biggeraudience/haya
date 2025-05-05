const serverless = require("serverless-http");
const app = require("../haya-backend/server.js");

module.exports = serverless(app);

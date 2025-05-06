// api/server.js

import serverless from 'serverless-http';

import createApp from '../haya-backend/server.js';

const app = createApp(process.env);

const handler = serverless(app);

export default handler;

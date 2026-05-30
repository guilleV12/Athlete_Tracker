import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app.listen(env.port, () => {
  console.log(
    `[server] http://localhost:${env.port}  (${env.nodeEnv}) — API: /api/v1/health, /api/v1/users`
  );
});

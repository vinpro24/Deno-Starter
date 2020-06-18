import "https://deno.land/x/dotenv/load.ts";

import { Application } from "https://deno.land/x/oak/mod.ts";
import { timer, logger, errorHandler } from "./middlewares/index.ts";
import routes from "./routes/index.ts";
import WebSocket from "./services/WebSocket/index.ts";
import "./services/Databases/MongoDB.js";
import config from "./constants/config.js";

const app = new Application();

// Middlewares
app.use(logger);
app.use(timer);
app.use(errorHandler);

// Routes
routes(app);

// WebSocket
WebSocket();

// Databases
// MongoDB

await app.listen({ port: config.PORT });

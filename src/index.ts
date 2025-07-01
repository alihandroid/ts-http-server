import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerPostUsers, handlerPutUsers } from "./api/users.js";
import { handlerReset } from "./api/reset.js";
import { handlerDeleteChirp, handlerGetChirp, handlerGetChirps, handlerPostChirps } from "./api/chirps.js";
import { handlerLogin, handlerRefresh, handlerRevoke } from "./api/login.js";
import { errorHandler, middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";

import { config } from "./config.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { handlerPolkaWebhooks } from "./api/polka.js";
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.use(middlewareLogResponses);

app.use(express.json());

app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
    Promise.resolve(handlerLogin(req, res)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
    Promise.resolve(handlerRefresh(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
    Promise.resolve(handlerRevoke(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerPostUsers(req, res)).catch(next);
});
app.put("/api/users", (req, res, next) => {
    Promise.resolve(handlerPutUsers(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerPostChirps(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerGetChirps(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(handlerGetChirp(req, res)).catch(next);
});
app.delete("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(handlerDeleteChirp(req, res)).catch(next);
});
app.post("/api/polka/webhooks", (req, res, next) => {
    Promise.resolve(handlerPolkaWebhooks(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next);
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handleMetrics, handleReset } from "./api/metrics.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);
app.get("/api/metrics", handleMetrics);
app.get("/api/reset", handleReset);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


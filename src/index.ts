import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handleMetrics, handleReset } from "./api/metrics.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerValidateChirp } from "./api/validation.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);
app.get("/admin/metrics", handleMetrics);
app.post("/admin/reset", handleReset);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


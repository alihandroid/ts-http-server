process.loadEnvFile();

type APIConfig = {
    fileServerHits: number;
    dbURL: string;
};

export const config: APIConfig = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL"),
};

function envOrThrow(key: string) {
    const val = process.env[key];
    if (!val) {
        throw new Error(`Environment variable ${key} must be set`);
    }
    return val;
}
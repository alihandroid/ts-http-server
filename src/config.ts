import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

export type APIConfig = {
    fileServerHits: number;
    db: DBConfig;
    platform: string;
    jwtSecret: string;
};

export type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig,
}

export const config: APIConfig = {
    fileServerHits: 0,
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: {
            migrationsFolder: "./src/db/migrations"
        }
    },
    platform: envOrThrow("PLATFORM"),
    jwtSecret: envOrThrow("JWT_SECRET"),
};


function envOrThrow(key: string) {
    const val = process.env[key];
    if (!val) {
        throw new Error(`Environment variable ${key} must be set`);
    }
    return val;
}
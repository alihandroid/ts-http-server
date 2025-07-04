import { relations } from "drizzle-orm";
import { pgTable, timestamp, varchar, uuid, text, boolean } from "drizzle-orm/pg-core";
import test from "node:test";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
    hashedPassword: varchar("hashed_password").default("unset").notNull(),
    isChirpyRed: boolean("is_chirpy_red").default(false).notNull(),
});

export type NewUser = typeof users.$inferInsert;

export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: text("body").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
});

export type NewChirp = typeof chirps.$inferInsert;

export const chirpsRelations = relations(chirps, ({ one }) => ({
    user: one(
        users,
        {
            fields: [chirps.userId],
            references: [users.id],
        }
    )
}));

export const refreshTokens = pgTable("refresh_tokens", {
    token: varchar("token").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at"),
});

export type NewResfreshToken = typeof refreshTokens.$inferInsert;
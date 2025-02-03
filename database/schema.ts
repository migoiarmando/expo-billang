import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user_tb = sqliteTable("users", {
    id: int().primaryKey({ autoIncrement: true }),
    onboarding: integer({ mode: "boolean" }).default(false),
    name: text().notNull(),
});

import { int, sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const user_tb = sqliteTable("users", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull().default(""),
    onboarding: integer({ mode: "boolean" }).default(false),
    currency: text().notNull().default("PHP"),
});

// To-do: Date, Duration
export const budget_tb = sqliteTable("budget", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    amount: real("amount").notNull().default(0),
    themeColor: text("theme_color").notNull().default("#E6E6E6"),
});

export const transactions_tb = sqliteTable("transactions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    amount: real("amount").notNull().default(0),
    category: text("category").notNull(),
    notes: text("notes").notNull().default(""),
});

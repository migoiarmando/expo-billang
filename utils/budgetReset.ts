import { db } from "@/database";
import { budget_tb, transactions_tb } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function resetBudgetsIfNeeded() {
    const budgets = await db.select().from(budget_tb);
    const now = new Date();

    for (const budget of budgets) {
        if (!budget.duration || !budget.lastReset) continue;

        const lastResetDate = new Date(budget.lastReset);
        const daysElapsed = Math.floor(
            (now.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        let shouldReset = false;
        if (budget.duration === "weekly" && daysElapsed >= 7) {
            shouldReset = true;
        } else if (budget.duration === "monthly" && daysElapsed >= 30) {
            shouldReset = true;
        }

        if (shouldReset) {
            await db
                .update(budget_tb)
                .set({
                    amount: budget.originalAmount ?? 0, // Use 0 if originalAmount is null
                    lastReset: now.toISOString(),
                })
                .where(eq(budget_tb.id, budget.id));

            // Delete all "Expense" transactions for this budget
            await db
                .delete(transactions_tb)
                .where(
                    and(
                        eq(transactions_tb.budgetId, budget.id),
                        eq(transactions_tb.type, "Expense"),
                    ),
                );
        }
    }
}

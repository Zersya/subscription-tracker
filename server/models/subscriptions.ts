import {tables, useDrizzle} from "~/server/utils/drizzle";
import {eq} from "drizzle-orm";

export function getData() {
    return useDrizzle().select().from(tables.subscriptions).all()
}

export async function createData(userId: number, name: string, description: string | null, price: number, currency: string, billingCycle: string, billingDay: number | null, startDate: Date, endDate: Date | null, nextBillingDate: Date, status: string, color: string | null) {
    const db = useDrizzle();
    const subscription = await db.insert(tables.subscriptions).values({
        userId,
        name,
        description,
        price,
        currency,
        billingCycle,
        billingDay,
        startDate,
        endDate,
        nextBillingDate,
        status,
        color,
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning().get();

    // Create recurring event for the subscription
    await db.insert(tables.recurringEvents).values({
        subscriptionId: subscription.id,
        eventType: 'payment',
        recurrenceRule: `FREQ=${billingCycle.toUpperCase()};INTERVAL=1`,
        nextOccurrence: nextBillingDate,
    }).returning().get();

    return subscription;
}

export function updateData(id: number, data: Partial<Omit<typeof tables.subscriptions.$inferInsert, 'id' | 'createdAt' | 'deletedAt'>>) {
    return useDrizzle().update(tables.subscriptions)
        .set({...data, updatedAt: new Date()})
        .where(eq(tables.subscriptions.id, id))
        .returning()
        .get()
}

export function deleteData(id: number) {
    return useDrizzle().update(tables.subscriptions).set({deletedAt: new Date()})
        .where(eq(tables.subscriptions.id, id))
        .returning()
        .get()
}

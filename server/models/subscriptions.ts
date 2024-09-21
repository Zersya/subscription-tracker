import {tables, useDrizzle} from "~/server/utils/drizzle";
import {eq} from "drizzle-orm";

export function getData() {
    return useDrizzle().select({
        id: tables.subscriptions.id,
        userId: tables.subscriptions.userId,
        name: tables.subscriptions.name,
        description: tables.subscriptions.description,
        price: tables.subscriptions.price,
        currency: tables.subscriptions.currency,
        billingCycle: tables.subscriptions.billingCycle,
        billingDay: tables.subscriptions.billingDay,
        startDate: tables.subscriptions.startDate,
        endDate: tables.subscriptions.endDate,
        nextBillingDate: tables.subscriptions.nextBillingDate,
        status: tables.subscriptions.status,
        color: tables.subscriptions.color,
        createdAt: tables.subscriptions.createdAt,
        updatedAt: tables.subscriptions.updatedAt,
        category: {
            id: tables.subscriptionCategories.id,
            subscriptionId: tables.subscriptionCategories.subscriptionId,
            categoryId: tables.subscriptionCategories.categoryId
        }
    }).from(tables.subscriptions)
        .leftJoin(tables.subscriptionCategories, eq(tables.subscriptionCategories.subscriptionId, tables.subscriptions.id))
        .all()
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

    // Calculate COUNT if endDate is defined
    let recurrenceRule = `FREQ=${billingCycle.toUpperCase()};INTERVAL=1`;
    if (endDate) {
        const startDateTime = new Date(startDate).getTime();
        const endDateTime = new Date(endDate).getTime();
        const cycleMilliseconds = {
            DAILY: 24 * 60 * 60 * 1000,
            WEEKLY: 7 * 24 * 60 * 60 * 1000,
            MONTHLY: 30 * 24 * 60 * 60 * 1000, // Approximation
            YEARLY: 365 * 24 * 60 * 60 * 1000, // Approximation
        };
        const cycleDuration = cycleMilliseconds[billingCycle.toUpperCase() as keyof typeof cycleMilliseconds];
        const count = Math.ceil((endDateTime - startDateTime) / cycleDuration);
        recurrenceRule += `;COUNT=${count}`;
    }

    // Create recurring event for the subscription
    await db.insert(tables.recurringEvents).values({
        subscriptionId: subscription.id,
        eventType: 'payment',
        recurrenceRule,
        nextOccurrence: nextBillingDate,
    }).returning().get();

    return subscription;
}

export async function updateData(id: number, data: Partial<Omit<typeof tables.subscriptions.$inferInsert, 'id' | 'createdAt' | 'deletedAt'>>) {
    const db = useDrizzle();
    const updatedSubscription = await db.update(tables.subscriptions)
        .set({...data, updatedAt: new Date()})
        .where(eq(tables.subscriptions.id, id))
        .returning()
        .get();

    if (data.billingCycle || data.startDate || data.endDate) {
        const subscription = await db.select().from(tables.subscriptions).where(eq(tables.subscriptions.id, id)).get();
        
        let recurrenceRule = `FREQ=${subscription.billingCycle.toUpperCase()};INTERVAL=1`;
        if (subscription.endDate) {
            const startDateTime = new Date(subscription.startDate).getTime();
            const endDateTime = new Date(subscription.endDate).getTime();
            const cycleMilliseconds = {
                DAILY: 24 * 60 * 60 * 1000,
                WEEKLY: 7 * 24 * 60 * 60 * 1000,
                MONTHLY: 30 * 24 * 60 * 60 * 1000, // Approximation
                YEARLY: 365 * 24 * 60 * 60 * 1000, // Approximation
            };
            const cycleDuration = cycleMilliseconds[subscription.billingCycle.toUpperCase() as keyof typeof cycleMilliseconds];
            const count = Math.ceil((endDateTime - startDateTime) / cycleDuration);
            recurrenceRule += `;COUNT=${count}`;
        }

        await db.update(tables.recurringEvents)
            .set({
                recurrenceRule,
                nextOccurrence: subscription.nextBillingDate,
            })
            .where(eq(tables.recurringEvents.subscriptionId, id))
            .execute();
    }

    return updatedSubscription;
}

export function deleteData(id: number) {
    return useDrizzle().update(tables.subscriptions).set({deletedAt: new Date()})
        .where(eq(tables.subscriptions.id, id))
        .returning()
        .get()
}

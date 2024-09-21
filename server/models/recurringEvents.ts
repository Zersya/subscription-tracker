import {tables, useDrizzle} from "~/server/utils/drizzle";
import {eq} from "drizzle-orm";

export function getData() {
    return useDrizzle().select({
        id: tables.recurringEvents.id,
        subscriptionId: tables.recurringEvents.subscriptionId,
        eventType: tables.recurringEvents.eventType,
        recurrenceRule: tables.recurringEvents.recurrenceRule,
        lastOccurrence: tables.recurringEvents.lastOccurrence,
        nextOccurrence: tables.recurringEvents.nextOccurrence,
        subscription: {
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
        }
    }).from(tables.recurringEvents)
        .leftJoin(tables.subscriptions, eq(tables.subscriptions.id, tables.recurringEvents.subscriptionId))
        .all()
}

export function createData(subscriptionId: number, eventType: string, recurrenceRule: string, lastOccurrence: Date | null, nextOccurrence: Date) {
    return useDrizzle().insert(tables.recurringEvents).values({
        subscriptionId,
        eventType,
        recurrenceRule,
        lastOccurrence,
        nextOccurrence
    }).returning().get()
}

export function updateData(id: number, data: Partial<Omit<typeof tables.recurringEvents.$inferInsert, 'id'>>) {
    return useDrizzle().update(tables.recurringEvents)
        .set(data)
        .where(eq(tables.recurringEvents.id, id))
        .returning()
        .get()
}

export function deleteData(id: number) {
    return useDrizzle().delete(tables.recurringEvents)
        .where(eq(tables.recurringEvents.id, id))
        .returning()
        .get()
}

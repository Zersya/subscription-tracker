import {tables, useDrizzle} from "~/server/utils/drizzle";
import {eq} from "drizzle-orm";

export function getData() {
    return useDrizzle().select().from(tables.recurringEvents).all()
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

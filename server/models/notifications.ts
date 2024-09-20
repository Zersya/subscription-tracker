import {tables, useDrizzle} from "~/server/utils/drizzle";
import {eq} from "drizzle-orm";

export function getData() {
    return useDrizzle().select().from(tables.notifications).all()
}


export function createData(userId: number, subscriptionId: number | null, type: string, message: string, isRead: boolean) {
    return useDrizzle().insert(tables.notifications).values({
        userId,
        subscriptionId,
        type,
        message,
        isRead,
        createdAt: new Date()
    }).returning().get()
}

export function updateData(id: number, isRead: boolean) {
    return useDrizzle().update(tables.notifications).set({isRead})
        .where(eq(tables.notifications.id, id))
        .returning()
        .get()
}

export function deleteData(id: number) {
    return useDrizzle().update(tables.notifications).set({deletedAt: new Date()})
        .where(eq(tables.notifications.id, id))
        .returning()
        .get()
}

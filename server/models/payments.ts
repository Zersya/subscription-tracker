import {tables, useDrizzle} from "~/server/utils/drizzle";
import {eq} from "drizzle-orm";

export function getData() {
    return useDrizzle().select().from(tables.payments).all()
}


export function createData(subscriptionId: number, amount: number, currency: string, paymentDate: Date, status: 'success' | 'failed' | 'pending') {
    return useDrizzle().insert(tables.payments).values({
        subscriptionId,
        amount,
        currency,
        paymentDate,
        status,
        createdAt: new Date(),
    }).returning().get()
}

export function updateData(id: number, status: 'success' | 'failed' | 'pending') {
    return useDrizzle().update(tables.payments).set({status})
        .where(eq(tables.payments.id, id))
        .returning()
        .get()
}

export function deleteData(id: number) {
    return useDrizzle().update(tables.payments).set({deletedAt: new Date()})
        .where(eq(tables.payments.id, id))
        .returning()
        .get()
}

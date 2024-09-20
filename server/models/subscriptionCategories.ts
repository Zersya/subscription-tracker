import {tables, useDrizzle} from "~/server/utils/drizzle";
import {eq, and} from "drizzle-orm";

export function getData() {
    return useDrizzle().select().from(tables.subscriptionCategories).all()
}

export function createData(subscriptionId: number, categoryId: number) {
    return useDrizzle().insert(tables.subscriptionCategories).values({
        subscriptionId,
        categoryId
    }).returning().get()
}

export function deleteData(subscriptionId: number, categoryId: number) {
    return useDrizzle().delete(tables.subscriptionCategories)
        .where(
            and(
                eq(tables.subscriptionCategories.subscriptionId, subscriptionId),
                eq(tables.subscriptionCategories.categoryId, categoryId)
            )
        )
        .returning()
        .get()
}

export function getBySubscriptionId(subscriptionId: number) {
    return useDrizzle().select().from(tables.subscriptionCategories)
        .where(eq(tables.subscriptionCategories.subscriptionId, subscriptionId))
        .all()
}

export function getByCategoryId(categoryId: number) {
    return useDrizzle().select().from(tables.subscriptionCategories)
        .where(eq(tables.subscriptionCategories.categoryId, categoryId))
        .all()
}

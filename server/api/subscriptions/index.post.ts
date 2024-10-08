import { createData } from "~/server/models/subscriptions";
import { createData as createSubscriptionCategory } from "~/server/models/subscriptionCategories";
import { handleAsync } from "~/server/utils/handleAsync";
import { resultCreated } from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const { userId, name, description, price, currency, billingCycle, billingDay, startDate, endDate, nextBillingDate, status, color, categoryId } = await readBody(event);

    const result = await createData(
        userId,
        name,
        description,
        price,
        currency,
        billingCycle,
        billingDay,
        new Date(startDate),
        endDate ? new Date(endDate) : null,
        new Date(nextBillingDate),
        status,
        color
    );

    if (categoryId) {
        await createSubscriptionCategory(result.id, categoryId);
    }

    return resultCreated(result, 'Subscription, recurring event, and category association created');
}));

import { updateData } from "~/server/models/subscriptions";
import { createData as createSubscriptionCategory, deleteData as deleteSubscriptionCategory } from "~/server/models/subscriptionCategories";
import { handleAsync } from "~/server/utils/handleAsync";
import { resultOK } from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const { id } = getRouterParams(event);
    const data = await readBody(event);
    const { categoryId, ...subscriptionData } = data;

    const result = await updateData(Number(id), subscriptionData);

    if (categoryId !== undefined) {
        // Delete existing category associations
        await deleteSubscriptionCategory(Number(id));
        
        // Create new category association if categoryId is provided
        if (categoryId !== null) {
            await createSubscriptionCategory(Number(id), categoryId);
        }
    }

    return resultOK(result);
}));

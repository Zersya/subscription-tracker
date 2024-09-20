import {createData} from "~/server/models/subscriptionCategories";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultCreated} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {subscriptionId, categoryId} = await readBody(event)

    const result = await createData(subscriptionId, categoryId)

    return resultCreated(result, 'Subscription category association created')
}))

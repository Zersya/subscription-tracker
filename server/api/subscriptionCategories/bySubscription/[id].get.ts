import {getBySubscriptionId} from "~/server/models/subscriptionCategories";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultOK} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {id} = getRouterParams(event)

    const result = await getBySubscriptionId(Number(id))

    return resultOK(result)
}))

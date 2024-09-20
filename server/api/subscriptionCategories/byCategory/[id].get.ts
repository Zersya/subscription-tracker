import {getByCategoryId} from "~/server/models/subscriptionCategories";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultOK} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {id} = getRouterParams(event)

    const result = await getByCategoryId(Number(id))

    return resultOK(result)
}))

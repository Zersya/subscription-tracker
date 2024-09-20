import {deleteData} from "~/server/models/subscriptionCategories";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultOK} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {subscriptionId, categoryId} = await readBody(event)

    const result = await deleteData(subscriptionId, categoryId)

    return resultOK(result)
}))

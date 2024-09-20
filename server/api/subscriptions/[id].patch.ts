import {updateData} from "~/server/models/subscriptions";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultOK} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {id} = getRouterParams(event)
    const data = await readBody(event)

    const result = await updateData(Number(id), data)

    return resultOK(result)
}))

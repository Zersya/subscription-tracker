import {updateData} from "~/server/models/payments";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultOK} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {id} = getRouterParams(event)
    const {status} = await readBody(event)

    const result = await updateData(Number(id), status)

    return resultOK(result)
}))

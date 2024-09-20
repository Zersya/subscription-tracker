import {updateData} from "~/server/models/notifications";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultOK} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {id} = getRouterParams(event)
    const {isRead} = await readBody(event)

    const result = await updateData(Number(id), isRead)

    return resultOK(result)
}))

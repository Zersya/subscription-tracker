import {deleteData} from "~/server/models/categories";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultOK} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {id} = getRouterParams(event)

    const result = await deleteData(Number(id))

    return resultOK(result)
}))

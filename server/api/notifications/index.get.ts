import {getData} from "~/server/models/notifications";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultOK} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const result = await getData()

    return resultOK(result)
}))

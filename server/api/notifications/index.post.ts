import {createData, getData} from "~/server/models/notifications";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultCreated} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {userId, subscriptionId, type, message, isRead} = await readBody(event)

    const result = await createData(userId, subscriptionId, type, message, isRead)

    return resultCreated(result, 'Notification created')
}))

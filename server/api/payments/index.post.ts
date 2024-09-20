import {createData, getData} from "~/server/models/payments";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultCreated} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {subscriptionId, amount, currency, paymentDate, status} = await readBody(event)

    const result = await createData(subscriptionId, amount, currency, paymentDate, status)

    return resultCreated(result, 'Notification created')
}))

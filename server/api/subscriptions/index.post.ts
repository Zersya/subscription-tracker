import {createData} from "~/server/models/subscriptions";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultCreated} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {userId, name, description, price, currency, billingCycle, billingDay, startDate, endDate, nextBillingDate, status, color} = await readBody(event)

    const result = await createData(userId, name, description, price, currency, billingCycle, billingDay, new Date(startDate), endDate ? new Date(endDate) : null, new Date(nextBillingDate), status, color)

    return resultCreated(result, 'Subscription created')
}))

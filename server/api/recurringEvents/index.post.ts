import {createData} from "~/server/models/recurringEvents";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultCreated} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {subscriptionId, eventType, recurrenceRule, lastOccurrence, nextOccurrence} = await readBody(event)

    const result = await createData(
        subscriptionId, 
        eventType, 
        recurrenceRule, 
        lastOccurrence ? new Date(lastOccurrence) : null, 
        new Date(nextOccurrence)
    )

    return resultCreated(result, 'Recurring event created')
}))

import {createData} from "~/server/models/categories";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultCreated} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {name, color} = await readBody(event)

    const result = await createData(name, color)

    return resultCreated(result, 'Category created')
}))

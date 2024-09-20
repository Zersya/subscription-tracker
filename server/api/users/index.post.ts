import {createData} from "~/server/models/users";
import {handleAsync} from "~/server/utils/handleAsync";
import {resultCreated} from "~/server/utils/handleResponseAPI";

export default eventHandler(handleAsync(async (event) => {
    const {name, email, password, avatar} = await readBody(event)

    const result = await createData(name, email, password, avatar)

    return resultCreated(result, 'User created')
}))

import {ResponseData, resultError} from "~~/server/utils/handleResponseAPI";

type EventHandler = (event: any) => Promise<ResponseData<any>>;

export function handleAsync(fn: EventHandler): EventHandler {
    return async (event): Promise<ResponseData<any>> => {
        const secretKey = useRuntimeConfig().public.APP_KEY;
        try {
            const data = await fn(event);
            setResponseStatus(event, data.statusCode)

            return data;
        } catch (error: any) {
            const statusCode = error.statusCode || 500;
            const message = error.message ?? error ?? 'Internal Server error';
            const result = resultError(statusCode, message, error);

            throw createError({
                statusCode: statusCode,
                message: message,
                data: result,
            });
        }
    };
}

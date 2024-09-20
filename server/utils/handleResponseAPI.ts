export interface ResponseData<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

export function resultOK<T>(data: T, message: string = 'OK'): ResponseData<T> {
    return {
        statusCode: 200,
        success: true,
        message,
        data,
    };
}

export function resultCreated<T>(data: T, message: string): ResponseData<T> {
    return {
        statusCode: 201,
        success: true,
        message,
        data,
    };
}

export function resultError<T>(statusCode: number, message: string, error?: T): ResponseData<T> {
    return {
        statusCode,
        success: false,
        message,
        error,
    };
}

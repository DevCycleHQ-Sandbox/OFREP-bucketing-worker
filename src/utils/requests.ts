export const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
}

export const timedFn = async <T, P extends unknown[]>(
    fn: (...params: P) => T | Promise<T>,
    ...params: P
): Promise<[number, T]> => {
    const t0 = new Date()
    const returnValue = await fn(...params)
    const t1 = new Date()
    return [t1.getTime() - t0.getTime(), returnValue]
}
export function isString(object: unknown) {
    return 'string' === typeof object;
}

export function isObject(object: unknown): object is Record<string, unknown> {
    return null !== object && 'object' === typeof object && !Array.isArray(object);
}

export function isInteger(object: unknown): object is number {
    return Number.isInteger(object);
}

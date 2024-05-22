import isInteger from 'lodash/isInteger';

export function isRecord(object: unknown): object is Record<string, unknown> {
    return null !== object && 'object' === typeof object && !Array.isArray(object);
}

export function objectIsInteger(object: unknown): object is number {
    return isInteger(object);
}

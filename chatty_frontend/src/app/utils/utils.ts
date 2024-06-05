export const isNotNullish = <T>(val: T | undefined | null): val is T =>
    val !== null && val !== undefined;

export const fallback = <T>(...vals: T[]): T | undefined => {
    for (let val of vals) {
        if (isNotNullish(val) && val !== '') {
            return val;
        }
    }
    return undefined;
}

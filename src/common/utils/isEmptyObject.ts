const ZERO_LENGTH = 0

export function isEmptyObject<T extends object>(
  obj: T | null | undefined,
): obj is T {
  if (obj === null || obj === undefined) {
    return false
  }
  return Object.keys(obj).length === ZERO_LENGTH && obj.constructor === Object
}

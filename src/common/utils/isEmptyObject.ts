export function isEmptyObject<T extends object>(
  obj: T | null | undefined
): obj is T {
  if (obj == null) {
    return false
  }
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

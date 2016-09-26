export function find (array, predicate) {
  for (var i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) return array[i]
  }
  return undefined
}

export function findIndex (array, predicate) {
  for (var i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) return i
  }
  return -1
}

export const deepObjectToArray = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj

  const keys = Object.keys(obj)
  if (keys.length === 0) return obj
  let isArrayLike = true
  for (let i = 0; i < keys.length; i++) {
    if (parseInt(keys[i], 10) !== i) {
      isArrayLike = false
      break
    }
  }

  if (isArrayLike) {
    return keys.map((key) => deepObjectToArray(obj[key]))
  }

  const result = {}
  for (const key in obj) {
    result[key] = deepObjectToArray(obj[key])
  }

  return result
}

export const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

export const debounce = (func, ms) => {
  let callStatus = false

  return (...rest) => {
    if (callStatus) {
      return
    }
    callStatus = true

    Reflect.apply(func, this, rest)

    setTimeout(() => {
      callStatus = false
    }, ms)
  }
}

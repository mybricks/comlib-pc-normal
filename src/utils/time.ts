const isMoment = (time: any) => {
  return time?._isValid || time?.$isDayjsObject
}

export {
  isMoment
}
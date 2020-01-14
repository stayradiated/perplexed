import Prism from '@zwolf/prism'

const toBoolean = ($data: Prism<any>): boolean => {
  const value = $data.value
  if (value == null) {
    return undefined
  }
  return value === 1 || value === '1' || value === 'true' || value === true
}

const toNumber = ($data: Prism<any>): number => {
  const value = $data.value
  if (value == null) {
    return undefined
  }
  return parseInt(value, 10)
}

const toTimestamp = ($data: Prism<any>) => {
  const value = $data.value
  if (value == null) {
    return undefined
  }
  return $data.transform(toNumber).value * 1000
}

const toDate = ($data: Prism<any>): Date => {
  const value = $data.value
  if (value == null) {
    return undefined
  }
  return new Date($data.value)
}

const toDateFromSeconds = ($data: Prism<any>): Date => {
  return $data.transform(toTimestamp).transform(toDate).value
}

export { toBoolean, toNumber, toTimestamp, toDate, toDateFromSeconds }

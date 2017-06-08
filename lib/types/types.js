export function parseBool (value) {
  return (
    value === 1 ||
    value === '1' ||
    value === 'true' ||
    value === true
  )
}


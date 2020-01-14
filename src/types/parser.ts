import Prism, { printWarnings } from '@zwolf/prism'

/**
 * @ignore
 */
const createParser = <T>(
  name: string,
  transformer: ($data: Prism<any>) => T,
) => {
  return (data: Record<string, any>): T => {
    const $data = new Prism(data)
    const result = $data.transform(transformer).value
    printWarnings($data.warnings, name)
    return result
  }
}

export { createParser }

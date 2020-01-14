import fs from 'fs'
import { ExecutionContext } from 'ava'
import { join } from 'path'
import { Scope } from 'nock'

import { normalizeSync } from './normalize'

const fixture = (name: string) => {
  const path = join(__dirname, '../testHelpers/fixtures', name)
  const content = fs.readFileSync(path, { encoding: 'utf8' })
  if (path.match(/\.json$/)) {
    return JSON.parse(content)
  }
  return content
}

const snapshot = (t: ExecutionContext, scope: Scope) => {
  return async (res: Record<string, any>) => {
    scope.done()
    t.snapshot(res)
    t.snapshot(normalizeSync(res))
  }
}

export { fixture, snapshot }

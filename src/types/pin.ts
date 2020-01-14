import Prism from '@zwolf/prism'

import { createParser } from './parser'

export interface Pin {
  id: number,
  code: string,
  expiresAt: Date,
  userId: string,
  clientIdentifier: string,
  authToken: string,
}

/**
 * @ignore
 */
const toPin = ($data: Prism<any>): Pin => {
  return {
    id: $data.get('id').value,
    code: $data.get('code').value,
    expiresAt: $data.get('expires_at').value,
    userId: $data.get('user_id').value,
    clientIdentifier: $data.get('client_identifier').value,
    authToken: $data.get('auth_token').value,
  }
}

/**
 * @ignore
 */
const parsePin = createParser('pin', toPin)

export { parsePin }

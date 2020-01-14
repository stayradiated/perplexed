import Prism from '@zwolf/prism'

import { createParser } from './parser'

const toPin = ($data: Prism<any>) => {
  return {
    id: $data.get('id').value,
    code: $data.get('code').value,
    expiresAt: $data.get('expires_at').value,
    userId: $data.get('user_id').value,
    clientIdentifier: $data.get('client_identifier').value,
    authToken: $data.get('auth_token').value,
  }
}

const parsePin = createParser('pin', toPin)

export { parsePin }

export function parsePin (data) {
  const {pin} = data

  const {
    id = null,
    code = null,
    expires_at = null,
    user_id = null,
    client_identifier = null,
    auth_token = null,
  } = pin

  return {
    id,
    code,
    expiresAt: expires_at,
    userId: user_id,
    clientIdentifier: client_identifier,
    authToken: auth_token,
  }
}

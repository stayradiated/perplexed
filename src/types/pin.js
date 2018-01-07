export function parsePin (data) {
  const { pin } = data

  const {
    id = null,
    code = null,
    expires_at: expiresAt = null,
    user_id: userId = null,
    client_identifier: clientIdentifier = null,
    auth_token: authToken = null
  } = pin

  return {
    id,
    code,
    expiresAt,
    userId,
    clientIdentifier,
    authToken
  }
}

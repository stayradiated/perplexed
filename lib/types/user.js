export function parseUser (data) {
  const {
    id = null,
    uuid = null,
    email = null,
    joined_at: joinedAt = null,
    username = null,
    title = null,
    thumb = null,
    authToken = null,
    authentication_token: authenticationToken = null,
    subscription = null,
    roles = null,
    entitlements = null,
    confirmedAt = null,
    forumId = null,
    rememberMe = null,
  } = data

  return {
    _type: 'user',
    id,
    uuid,
    email,
    joinedAt,
    username,
    title,
    thumb,
    authToken,
    authenticationToken,
    subscription,
    roles,
    entitlements,
    confirmedAt,
    forumId,
    rememberMe,
  }
}

export function parseSignIn (data) {
  return parseUser(data.user)
}

export function parseUser (data) {
  const user = {}

  user.id = data.id
  user.uuid = data.uuid
  user.email = data.email
  user.joined_at = data.joined_at
  user.username = data.username
  user.title = data.title
  user.thumb = data.thumb
  user.authToken = data.authToken
  user.authentication_token = data.authentication_token
  user.subscription = data.subscription
  user.roles = data.roles
  user.entitlements = data.entitlements
  user.confirmedAt = data.confirmedAt
  user.forumId = data.forumId
  user.rememberMe = data.rememberMe

  return user
}

export function parseSignIn (data) {
  return parseUser(data.user)
}

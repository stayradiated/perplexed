import Prism from '@zwolf/prism'

import { createParser } from './parser'
import { toDateFromSeconds } from './types'

export interface Subscription {
  _type: string,
  id: unknown,
  mode: string,
  renewsAt: number,
  endsAt: number,
  type: string,
  transfer: boolean,
  state: string,
}

const toSubscription = ($data: Prism<any>): Subscription => {
  return {
    _type: 'subscription',
    id: $data.get('id').value,
    mode: $data.get('mode').value,
    renewsAt: $data.get('renewsAt').value,
    endsAt: $data.get('endsAt').value,
    type: $data.get('type').value,
    transfer: $data.get('transfer').value,
    state: $data.get('state').value,
  }
}

export interface Service {
  _type: string,
  identifier: string,
  endpoint: string,
  token: string,
  status: string,
}

const toService = ($data: Prism<any>): Service => {
  return {
    _type: 'service',
    identifier: $data.get('identifier').value,
    endpoint: $data.get('endpoint').value,
    token: $data.get('token', { quiet: true }).value,
    status: $data.get('status').value,
  }
}

export interface User {
  _type: string,
  id: number,
  authToken: string,
  certificateVersion: number,
  country: string,
  email: string,
  emailOnlyAuth: boolean,
  entitlements: string[],
  guest: boolean,
  hasPassword: boolean,
  home: boolean,
  homeAdmin: boolean,
  homeSize: number,
  locale: string,
  mailingListActive: boolean,
  mailingListStatus: string,
  maxHomeSize: number,
  protected: boolean,
  queueEmail: string,
  queueUid: unknown,
  rememberExpiresAt: Date,
  restricted: boolean,
  scrobbleTypes: string,
  services: Service[],
  subscriptionDescription: string,
  subscriptions: Subscription[],
  thumb: string,
  title: string,
  username: string,
  uuid: string,
}

const toUser = ($data: Prism<any>): User => {
  return {
    _type: 'user',

    id: $data.get<number>('id').value,

    authToken: $data.get<string>('authToken').value,
    certificateVersion: $data.get<number>('certificateVersion').value,
    country: $data.get<string>('country').value,
    email: $data.get<string>('email').value,
    emailOnlyAuth: $data.get<boolean>('emailOnlyAuth').value,
    entitlements: $data
      .get('entitlements')
      .toArray()
      .map(($data: Prism<string>) => $data.value),
    guest: $data.get<boolean>('guest').value,
    hasPassword: $data.get<boolean>('hasPassword').value,
    home: $data.get<boolean>('home').value,
    homeAdmin: $data.get<boolean>('homeAdmin').value,
    homeSize: $data.get<number>('homeSize').value,
    locale: $data.get<string>('locale').value,
    mailingListActive: $data.get<boolean>('mailingListActive').value,
    mailingListStatus: $data.get<string>('mailingListStatus').value,
    maxHomeSize: $data.get<number>('maxHomeSize').value,
    protected: $data.get<boolean>('protected').value,
    queueEmail: $data.get<string>('queueEmail').value,
    queueUid: $data.get<unknown>('queueUid').value,
    rememberExpiresAt: $data
      .get<number>('rememberExpiresAt')
      .transform(toDateFromSeconds).value,
    restricted: $data.get<boolean>('restricted').value,
    scrobbleTypes: $data.get<string>('scrobbleTypes').value,
    services: $data
      .get('services')
      .toArray()
      .map(toService),
    subscriptionDescription: $data.get<string>('subscriptionDescription').value,
    subscriptions: $data
      .get('subscriptions')
      .toArray()
      .map(toSubscription),
    thumb: $data.get<string>('thumb').value,
    title: $data.get<string>('title').value,
    username: $data.get<string>('username').value,
    uuid: $data.get<string>('uuid').value,
  }
}

const parseUser = createParser('user', toUser)

export { toUser, parseUser }

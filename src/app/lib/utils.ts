import crypto from 'crypto'

export const getId = (len: number = 20) =>
  crypto.randomBytes(len).toString('base64url')

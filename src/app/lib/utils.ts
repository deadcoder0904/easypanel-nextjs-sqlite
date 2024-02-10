import crypto from 'node:crypto'

export const getId = (len: number = 20) =>
  crypto.randomBytes(len).toString('base64url')

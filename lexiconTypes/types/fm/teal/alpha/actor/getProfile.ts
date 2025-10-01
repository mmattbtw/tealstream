/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../../lexicons'
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from '../../../../../util'
import type * as FmTealAlphaActorDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'fm.teal.alpha.actor.getProfile'

export type QueryParams = {
  /** The author's DID */
  actor: string
}
export type InputSchema = undefined

export interface OutputSchema {
  actor: FmTealAlphaActorDefs.ProfileView
}

export interface CallOptions {
  signal?: AbortSignal
  headers?: HeadersMap
}

export interface Response {
  success: boolean
  headers: HeadersMap
  data: OutputSchema
}

export function toKnownErr(e: any) {
  return e
}

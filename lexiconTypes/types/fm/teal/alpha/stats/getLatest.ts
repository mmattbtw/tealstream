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
import type * as FmTealAlphaFeedDefs from '../feed/defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'fm.teal.alpha.stats.getLatest'

export type QueryParams = {
  /** Number of latest plays to return */
  limit?: number
}
export type InputSchema = undefined

export interface OutputSchema {
  plays: FmTealAlphaFeedDefs.PlayView[]
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

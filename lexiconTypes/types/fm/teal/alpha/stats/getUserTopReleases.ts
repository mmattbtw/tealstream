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
import type * as FmTealAlphaStatsDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'fm.teal.alpha.stats.getUserTopReleases'

export type QueryParams = {
  /** The user's DID or handle */
  actor: string
  /** Time period for top releases */
  period?: '30days' | '7days'
  /** Number of releases to return */
  limit?: number
  /** Pagination cursor */
  cursor?: string
}
export type InputSchema = undefined

export interface OutputSchema {
  releases: FmTealAlphaStatsDefs.ReleaseView[]
  /** Next page cursor */
  cursor?: string
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

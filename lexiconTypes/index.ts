/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  ComAtprotoRepoCreateRecord,
  ComAtprotoRepoDeleteRecord,
  ComAtprotoRepoGetRecord,
  ComAtprotoRepoListRecords,
  ComAtprotoRepoPutRecord,
} from "@atproto/api";
import {
  XrpcClient,
  type FetchHandler,
  type FetchHandlerOptions,
} from "@atproto/xrpc";
import { schemas } from "./lexicons.js";
import * as FmTealAlphaActorGetProfile from "./types/fm/teal/alpha/actor/getProfile.js";
import * as FmTealAlphaActorGetProfiles from "./types/fm/teal/alpha/actor/getProfiles.js";
import * as FmTealAlphaActorProfile from "./types/fm/teal/alpha/actor/profile.js";
import * as FmTealAlphaActorProfileStatus from "./types/fm/teal/alpha/actor/profileStatus.js";
import * as FmTealAlphaActorSearchActors from "./types/fm/teal/alpha/actor/searchActors.js";
import * as FmTealAlphaActorStatus from "./types/fm/teal/alpha/actor/status.js";
import * as FmTealAlphaFeedGetActorFeed from "./types/fm/teal/alpha/feed/getActorFeed.js";
import * as FmTealAlphaFeedGetPlay from "./types/fm/teal/alpha/feed/getPlay.js";
import * as FmTealAlphaFeedPlay from "./types/fm/teal/alpha/feed/play.js";
import * as FmTealAlphaStatsGetLatest from "./types/fm/teal/alpha/stats/getLatest.js";
import * as FmTealAlphaStatsGetTopArtists from "./types/fm/teal/alpha/stats/getTopArtists.js";
import * as FmTealAlphaStatsGetTopReleases from "./types/fm/teal/alpha/stats/getTopReleases.js";
import * as FmTealAlphaStatsGetUserTopArtists from "./types/fm/teal/alpha/stats/getUserTopArtists.js";
import * as FmTealAlphaStatsGetUserTopReleases from "./types/fm/teal/alpha/stats/getUserTopReleases.js";
import { type OmitKey, type Un$Typed } from "./util.js";

export * as FmTealAlphaActorDefs from "./types/fm/teal/alpha/actor/defs.js";
export * as FmTealAlphaActorGetProfile from "./types/fm/teal/alpha/actor/getProfile.js";
export * as FmTealAlphaActorGetProfiles from "./types/fm/teal/alpha/actor/getProfiles.js";
export * as FmTealAlphaActorProfile from "./types/fm/teal/alpha/actor/profile.js";
export * as FmTealAlphaActorProfileStatus from "./types/fm/teal/alpha/actor/profileStatus.js";
export * as FmTealAlphaActorSearchActors from "./types/fm/teal/alpha/actor/searchActors.js";
export * as FmTealAlphaActorStatus from "./types/fm/teal/alpha/actor/status.js";
export * as FmTealAlphaFeedDefs from "./types/fm/teal/alpha/feed/defs.js";
export * as FmTealAlphaFeedGetActorFeed from "./types/fm/teal/alpha/feed/getActorFeed.js";
export * as FmTealAlphaFeedGetPlay from "./types/fm/teal/alpha/feed/getPlay.js";
export * as FmTealAlphaFeedPlay from "./types/fm/teal/alpha/feed/play.js";
export * as FmTealAlphaStatsDefs from "./types/fm/teal/alpha/stats/defs.js";
export * as FmTealAlphaStatsGetLatest from "./types/fm/teal/alpha/stats/getLatest.js";
export * as FmTealAlphaStatsGetTopArtists from "./types/fm/teal/alpha/stats/getTopArtists.js";
export * as FmTealAlphaStatsGetTopReleases from "./types/fm/teal/alpha/stats/getTopReleases.js";
export * as FmTealAlphaStatsGetUserTopArtists from "./types/fm/teal/alpha/stats/getUserTopArtists.js";
export * as FmTealAlphaStatsGetUserTopReleases from "./types/fm/teal/alpha/stats/getUserTopReleases.js";

export class AtpBaseClient extends XrpcClient {
  fm: FmNS;

  constructor(options: FetchHandler | FetchHandlerOptions) {
    super(options, schemas);
    this.fm = new FmNS(this);
  }

  /** @deprecated use `this` instead */
  get xrpc(): XrpcClient {
    return this;
  }
}

export class FmNS {
  _client: XrpcClient;
  teal: FmTealNS;

  constructor(client: XrpcClient) {
    this._client = client;
    this.teal = new FmTealNS(client);
  }
}

export class FmTealNS {
  _client: XrpcClient;
  alpha: FmTealAlphaNS;

  constructor(client: XrpcClient) {
    this._client = client;
    this.alpha = new FmTealAlphaNS(client);
  }
}

export class FmTealAlphaNS {
  _client: XrpcClient;
  actor: FmTealAlphaActorNS;
  feed: FmTealAlphaFeedNS;
  stats: FmTealAlphaStatsNS;

  constructor(client: XrpcClient) {
    this._client = client;
    this.actor = new FmTealAlphaActorNS(client);
    this.feed = new FmTealAlphaFeedNS(client);
    this.stats = new FmTealAlphaStatsNS(client);
  }
}

export class FmTealAlphaActorNS {
  _client: XrpcClient;
  profile: FmTealAlphaActorProfileRecord;
  profileStatus: FmTealAlphaActorProfileStatusRecord;
  status: FmTealAlphaActorStatusRecord;

  constructor(client: XrpcClient) {
    this._client = client;
    this.profile = new FmTealAlphaActorProfileRecord(client);
    this.profileStatus = new FmTealAlphaActorProfileStatusRecord(client);
    this.status = new FmTealAlphaActorStatusRecord(client);
  }

  getProfile(
    params?: FmTealAlphaActorGetProfile.QueryParams,
    opts?: FmTealAlphaActorGetProfile.CallOptions
  ): Promise<FmTealAlphaActorGetProfile.Response> {
    return this._client.call(
      "fm.teal.alpha.actor.getProfile",
      params,
      undefined,
      opts
    );
  }

  getProfiles(
    params?: FmTealAlphaActorGetProfiles.QueryParams,
    opts?: FmTealAlphaActorGetProfiles.CallOptions
  ): Promise<FmTealAlphaActorGetProfiles.Response> {
    return this._client.call(
      "fm.teal.alpha.actor.getProfiles",
      params,
      undefined,
      opts
    );
  }

  searchActors(
    params?: FmTealAlphaActorSearchActors.QueryParams,
    opts?: FmTealAlphaActorSearchActors.CallOptions
  ): Promise<FmTealAlphaActorSearchActors.Response> {
    return this._client.call(
      "fm.teal.alpha.actor.searchActors",
      params,
      undefined,
      opts
    );
  }
}

export class FmTealAlphaActorProfileRecord {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, "collection">
  ): Promise<{
    cursor?: string;
    records: { uri: string; value: FmTealAlphaActorProfile.Record }[];
  }> {
    const res = await this._client.call("com.atproto.repo.listRecords", {
      collection: "fm.teal.alpha.actor.profile",
      ...params,
    });
    return res.data;
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, "collection">
  ): Promise<{
    uri: string;
    cid: string;
    value: FmTealAlphaActorProfile.Record;
  }> {
    const res = await this._client.call("com.atproto.repo.getRecord", {
      collection: "fm.teal.alpha.actor.profile",
      ...params,
    });
    return res.data;
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      "collection" | "record"
    >,
    record: Un$Typed<FmTealAlphaActorProfile.Record>,
    headers?: Record<string, string>
  ): Promise<{ uri: string; cid: string }> {
    const collection = "fm.teal.alpha.actor.profile";
    const res = await this._client.call(
      "com.atproto.repo.createRecord",
      undefined,
      {
        collection,
        rkey: "self",
        ...params,
        record: { ...record, $type: collection },
      },
      { encoding: "application/json", headers }
    );
    return res.data;
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      "collection" | "record"
    >,
    record: Un$Typed<FmTealAlphaActorProfile.Record>,
    headers?: Record<string, string>
  ): Promise<{ uri: string; cid: string }> {
    const collection = "fm.teal.alpha.actor.profile";
    const res = await this._client.call(
      "com.atproto.repo.putRecord",
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: "application/json", headers }
    );
    return res.data;
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, "collection">,
    headers?: Record<string, string>
  ): Promise<void> {
    await this._client.call(
      "com.atproto.repo.deleteRecord",
      undefined,
      { collection: "fm.teal.alpha.actor.profile", ...params },
      { headers }
    );
  }
}

export class FmTealAlphaActorProfileStatusRecord {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, "collection">
  ): Promise<{
    cursor?: string;
    records: { uri: string; value: FmTealAlphaActorProfileStatus.Record }[];
  }> {
    const res = await this._client.call("com.atproto.repo.listRecords", {
      collection: "fm.teal.alpha.actor.profileStatus",
      ...params,
    });
    return res.data;
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, "collection">
  ): Promise<{
    uri: string;
    cid: string;
    value: FmTealAlphaActorProfileStatus.Record;
  }> {
    const res = await this._client.call("com.atproto.repo.getRecord", {
      collection: "fm.teal.alpha.actor.profileStatus",
      ...params,
    });
    return res.data;
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      "collection" | "record"
    >,
    record: Un$Typed<FmTealAlphaActorProfileStatus.Record>,
    headers?: Record<string, string>
  ): Promise<{ uri: string; cid: string }> {
    const collection = "fm.teal.alpha.actor.profileStatus";
    const res = await this._client.call(
      "com.atproto.repo.createRecord",
      undefined,
      {
        collection,
        rkey: "self",
        ...params,
        record: { ...record, $type: collection },
      },
      { encoding: "application/json", headers }
    );
    return res.data;
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      "collection" | "record"
    >,
    record: Un$Typed<FmTealAlphaActorProfileStatus.Record>,
    headers?: Record<string, string>
  ): Promise<{ uri: string; cid: string }> {
    const collection = "fm.teal.alpha.actor.profileStatus";
    const res = await this._client.call(
      "com.atproto.repo.putRecord",
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: "application/json", headers }
    );
    return res.data;
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, "collection">,
    headers?: Record<string, string>
  ): Promise<void> {
    await this._client.call(
      "com.atproto.repo.deleteRecord",
      undefined,
      { collection: "fm.teal.alpha.actor.profileStatus", ...params },
      { headers }
    );
  }
}

export class FmTealAlphaActorStatusRecord {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, "collection">
  ): Promise<{
    cursor?: string;
    records: { uri: string; value: FmTealAlphaActorStatus.Record }[];
  }> {
    const res = await this._client.call("com.atproto.repo.listRecords", {
      collection: "fm.teal.alpha.actor.status",
      ...params,
    });
    return res.data;
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, "collection">
  ): Promise<{
    uri: string;
    cid: string;
    value: FmTealAlphaActorStatus.Record;
  }> {
    const res = await this._client.call("com.atproto.repo.getRecord", {
      collection: "fm.teal.alpha.actor.status",
      ...params,
    });
    return res.data;
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      "collection" | "record"
    >,
    record: Un$Typed<FmTealAlphaActorStatus.Record>,
    headers?: Record<string, string>
  ): Promise<{ uri: string; cid: string }> {
    const collection = "fm.teal.alpha.actor.status";
    const res = await this._client.call(
      "com.atproto.repo.createRecord",
      undefined,
      {
        collection,
        rkey: "self",
        ...params,
        record: { ...record, $type: collection },
      },
      { encoding: "application/json", headers }
    );
    return res.data;
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      "collection" | "record"
    >,
    record: Un$Typed<FmTealAlphaActorStatus.Record>,
    headers?: Record<string, string>
  ): Promise<{ uri: string; cid: string }> {
    const collection = "fm.teal.alpha.actor.status";
    const res = await this._client.call(
      "com.atproto.repo.putRecord",
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: "application/json", headers }
    );
    return res.data;
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, "collection">,
    headers?: Record<string, string>
  ): Promise<void> {
    await this._client.call(
      "com.atproto.repo.deleteRecord",
      undefined,
      { collection: "fm.teal.alpha.actor.status", ...params },
      { headers }
    );
  }
}

export class FmTealAlphaFeedNS {
  _client: XrpcClient;
  play: FmTealAlphaFeedPlayRecord;

  constructor(client: XrpcClient) {
    this._client = client;
    this.play = new FmTealAlphaFeedPlayRecord(client);
  }

  getActorFeed(
    params?: FmTealAlphaFeedGetActorFeed.QueryParams,
    opts?: FmTealAlphaFeedGetActorFeed.CallOptions
  ): Promise<FmTealAlphaFeedGetActorFeed.Response> {
    return this._client.call(
      "fm.teal.alpha.feed.getActorFeed",
      params,
      undefined,
      opts
    );
  }

  getPlay(
    params?: FmTealAlphaFeedGetPlay.QueryParams,
    opts?: FmTealAlphaFeedGetPlay.CallOptions
  ): Promise<FmTealAlphaFeedGetPlay.Response> {
    return this._client.call(
      "fm.teal.alpha.feed.getPlay",
      params,
      undefined,
      opts
    );
  }
}

export class FmTealAlphaFeedPlayRecord {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, "collection">
  ): Promise<{
    cursor?: string;
    records: { uri: string; value: FmTealAlphaFeedPlay.Record }[];
  }> {
    const res = await this._client.call("com.atproto.repo.listRecords", {
      collection: "fm.teal.alpha.feed.play",
      ...params,
    });
    return res.data;
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, "collection">
  ): Promise<{ uri: string; cid: string; value: FmTealAlphaFeedPlay.Record }> {
    const res = await this._client.call("com.atproto.repo.getRecord", {
      collection: "fm.teal.alpha.feed.play",
      ...params,
    });
    return res.data;
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      "collection" | "record"
    >,
    record: Un$Typed<FmTealAlphaFeedPlay.Record>,
    headers?: Record<string, string>
  ): Promise<{ uri: string; cid: string }> {
    const collection = "fm.teal.alpha.feed.play";
    const res = await this._client.call(
      "com.atproto.repo.createRecord",
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: "application/json", headers }
    );
    return res.data;
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      "collection" | "record"
    >,
    record: Un$Typed<FmTealAlphaFeedPlay.Record>,
    headers?: Record<string, string>
  ): Promise<{ uri: string; cid: string }> {
    const collection = "fm.teal.alpha.feed.play";
    const res = await this._client.call(
      "com.atproto.repo.putRecord",
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: "application/json", headers }
    );
    return res.data;
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, "collection">,
    headers?: Record<string, string>
  ): Promise<void> {
    await this._client.call(
      "com.atproto.repo.deleteRecord",
      undefined,
      { collection: "fm.teal.alpha.feed.play", ...params },
      { headers }
    );
  }
}

export class FmTealAlphaStatsNS {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  getLatest(
    params?: FmTealAlphaStatsGetLatest.QueryParams,
    opts?: FmTealAlphaStatsGetLatest.CallOptions
  ): Promise<FmTealAlphaStatsGetLatest.Response> {
    return this._client.call(
      "fm.teal.alpha.stats.getLatest",
      params,
      undefined,
      opts
    );
  }

  getTopArtists(
    params?: FmTealAlphaStatsGetTopArtists.QueryParams,
    opts?: FmTealAlphaStatsGetTopArtists.CallOptions
  ): Promise<FmTealAlphaStatsGetTopArtists.Response> {
    return this._client.call(
      "fm.teal.alpha.stats.getTopArtists",
      params,
      undefined,
      opts
    );
  }

  getTopReleases(
    params?: FmTealAlphaStatsGetTopReleases.QueryParams,
    opts?: FmTealAlphaStatsGetTopReleases.CallOptions
  ): Promise<FmTealAlphaStatsGetTopReleases.Response> {
    return this._client.call(
      "fm.teal.alpha.stats.getTopReleases",
      params,
      undefined,
      opts
    );
  }

  getUserTopArtists(
    params?: FmTealAlphaStatsGetUserTopArtists.QueryParams,
    opts?: FmTealAlphaStatsGetUserTopArtists.CallOptions
  ): Promise<FmTealAlphaStatsGetUserTopArtists.Response> {
    return this._client.call(
      "fm.teal.alpha.stats.getUserTopArtists",
      params,
      undefined,
      opts
    );
  }

  getUserTopReleases(
    params?: FmTealAlphaStatsGetUserTopReleases.QueryParams,
    opts?: FmTealAlphaStatsGetUserTopReleases.CallOptions
  ): Promise<FmTealAlphaStatsGetUserTopReleases.Response> {
    return this._client.call(
      "fm.teal.alpha.stats.getUserTopReleases",
      params,
      undefined,
      opts
    );
  }
}

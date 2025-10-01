/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type LexiconDoc,
  Lexicons,
  ValidationError,
  type ValidationResult,
} from '@atproto/lexicon'
import { type $Typed, is$typed, maybe$typed } from './util.js'

export const schemaDict = {
  FmTealAlphaActorDefs: {
    lexicon: 1,
    id: 'fm.teal.alpha.actor.defs',
    defs: {
      profileView: {
        type: 'object',
        properties: {
          did: {
            type: 'string',
            description: 'The decentralized identifier of the actor',
          },
          displayName: {
            type: 'string',
          },
          description: {
            type: 'string',
            description: 'Free-form profile description text.',
          },
          descriptionFacets: {
            type: 'array',
            description:
              'Annotations of text in the profile description (mentions, URLs, hashtags, etc). May be changed to another (backwards compatible) lexicon.',
            items: {
              type: 'ref',
              ref: 'lex:app.bsky.richtext.facet',
            },
          },
          featuredItem: {
            type: 'ref',
            description:
              "The user's most recent item featured on their profile.",
            ref: 'lex:fm.teal.alpha.actor.profile#featuredItem',
          },
          avatar: {
            type: 'string',
            description: 'IPLD of the avatar',
          },
          banner: {
            type: 'string',
            description: 'IPLD of the banner image',
          },
          status: {
            type: 'ref',
            ref: 'lex:fm.teal.alpha.actor.defs#statusView',
          },
          createdAt: {
            type: 'string',
            format: 'datetime',
          },
        },
      },
      miniProfileView: {
        type: 'object',
        properties: {
          did: {
            type: 'string',
            description: 'The decentralized identifier of the actor',
          },
          displayName: {
            type: 'string',
          },
          handle: {
            type: 'string',
          },
          avatar: {
            type: 'string',
            description: 'IPLD of the avatar',
          },
        },
      },
      statusView: {
        type: 'object',
        description: 'A declaration of the status of the actor.',
        properties: {
          time: {
            type: 'string',
            format: 'datetime',
            description: 'The unix timestamp of when the item was recorded',
          },
          expiry: {
            type: 'string',
            format: 'datetime',
            description:
              'The unix timestamp of the expiry time of the item. If unavailable, default to 10 minutes past the start time.',
          },
          item: {
            type: 'ref',
            ref: 'lex:fm.teal.alpha.feed.defs#playView',
          },
        },
      },
    },
  },
  FmTealAlphaActorGetProfile: {
    lexicon: 1,
    id: 'fm.teal.alpha.actor.getProfile',
    description:
      'This lexicon is in a not officially released state. It is subject to change. | Retrieves a play given an author DID and record key.',
    defs: {
      main: {
        type: 'query',
        parameters: {
          type: 'params',
          required: ['actor'],
          properties: {
            actor: {
              type: 'string',
              format: 'at-identifier',
              description: "The author's DID",
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['actor'],
            properties: {
              actor: {
                type: 'ref',
                ref: 'lex:fm.teal.alpha.actor.defs#profileView',
              },
            },
          },
        },
      },
    },
  },
  FmTealAlphaActorGetProfiles: {
    lexicon: 1,
    id: 'fm.teal.alpha.actor.getProfiles',
    description:
      'This lexicon is in a not officially released state. It is subject to change. | Retrieves the associated profile.',
    defs: {
      main: {
        type: 'query',
        parameters: {
          type: 'params',
          required: ['actors'],
          properties: {
            actors: {
              type: 'array',
              items: {
                type: 'string',
                format: 'at-identifier',
              },
              description: 'Array of actor DIDs',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['actors'],
            properties: {
              actors: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:fm.teal.alpha.actor.defs#miniProfileView',
                },
              },
            },
          },
        },
      },
    },
  },
  FmTealAlphaActorProfile: {
    lexicon: 1,
    id: 'fm.teal.alpha.actor.profile',
    defs: {
      main: {
        type: 'record',
        description:
          'This lexicon is in a not officially released state. It is subject to change. | A declaration of a teal.fm account profile.',
        key: 'literal:self',
        record: {
          type: 'object',
          properties: {
            displayName: {
              type: 'string',
              maxGraphemes: 64,
              maxLength: 640,
            },
            description: {
              type: 'string',
              description: 'Free-form profile description text.',
              maxGraphemes: 256,
              maxLength: 2560,
            },
            descriptionFacets: {
              type: 'array',
              description:
                'Annotations of text in the profile description (mentions, URLs, hashtags, etc).',
              items: {
                type: 'ref',
                ref: 'lex:app.bsky.richtext.facet',
              },
            },
            featuredItem: {
              type: 'ref',
              description:
                "The user's most recent item featured on their profile.",
              ref: 'lex:fm.teal.alpha.actor.profile#featuredItem',
            },
            avatar: {
              type: 'blob',
              description:
                "Small image to be displayed next to posts from account. AKA, 'profile picture'",
              accept: ['image/png', 'image/jpeg'],
              maxSize: 1000000,
            },
            banner: {
              type: 'blob',
              description:
                'Larger horizontal image to display behind profile view.',
              accept: ['image/png', 'image/jpeg'],
              maxSize: 1000000,
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
      featuredItem: {
        type: 'object',
        required: ['mbid', 'type'],
        properties: {
          mbid: {
            type: 'string',
            description: 'The Musicbrainz ID of the item',
          },
          type: {
            type: 'string',
            description:
              'The type of the item. Must be a valid Musicbrainz type, e.g. album, track, recording, etc.',
          },
        },
      },
    },
  },
  FmTealAlphaActorProfileStatus: {
    lexicon: 1,
    id: 'fm.teal.alpha.actor.profileStatus',
    defs: {
      main: {
        type: 'record',
        description:
          'This lexicon is in a not officially released state. It is subject to change. | A declaration of the profile status of the actor.',
        key: 'literal:self',
        record: {
          type: 'object',
          required: ['completedOnboarding'],
          properties: {
            completedOnboarding: {
              type: 'string',
              description: 'The onboarding completion status',
              knownValues: [
                'none',
                'profileOnboarding',
                'playOnboarding',
                'complete',
              ],
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
              description: 'The timestamp when this status was created',
            },
            updatedAt: {
              type: 'string',
              format: 'datetime',
              description: 'The timestamp when this status was last updated',
            },
          },
        },
      },
    },
  },
  FmTealAlphaActorSearchActors: {
    lexicon: 1,
    id: 'fm.teal.alpha.actor.searchActors',
    description:
      'This lexicon is in a not officially released state. It is subject to change. | Searches for actors based on profile contents.',
    defs: {
      main: {
        type: 'query',
        parameters: {
          type: 'params',
          required: ['q'],
          properties: {
            q: {
              type: 'string',
              description: 'The search query',
              maxGraphemes: 128,
              maxLength: 640,
            },
            limit: {
              type: 'integer',
              description: 'The maximum number of actors to return',
              minimum: 1,
              maximum: 25,
            },
            cursor: {
              type: 'string',
              description: 'Cursor for pagination',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['actors'],
            properties: {
              actors: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:fm.teal.alpha.actor.defs#miniProfileView',
                },
              },
              cursor: {
                type: 'string',
                description: 'Cursor for pagination',
              },
            },
          },
        },
      },
    },
  },
  FmTealAlphaActorStatus: {
    lexicon: 1,
    id: 'fm.teal.alpha.actor.status',
    defs: {
      main: {
        type: 'record',
        description:
          'This lexicon is in a not officially released state. It is subject to change. | A declaration of the status of the actor. Only one can be shown at a time. If there are multiple, the latest record should be picked and earlier records should be deleted or tombstoned.',
        key: 'literal:self',
        record: {
          type: 'object',
          required: ['time', 'item'],
          properties: {
            time: {
              type: 'string',
              format: 'datetime',
              description: 'The unix timestamp of when the item was recorded',
            },
            expiry: {
              type: 'string',
              format: 'datetime',
              description:
                'The unix timestamp of the expiry time of the item. If unavailable, default to 10 minutes past the start time.',
            },
            item: {
              type: 'ref',
              ref: 'lex:fm.teal.alpha.feed.defs#playView',
            },
          },
        },
      },
    },
  },
  FmTealAlphaFeedDefs: {
    lexicon: 1,
    id: 'fm.teal.alpha.feed.defs',
    description:
      'This lexicon is in a not officially released state. It is subject to change. | Misc. items related to feeds.',
    defs: {
      playView: {
        type: 'object',
        required: ['trackName', 'artists'],
        properties: {
          trackName: {
            type: 'string',
            minLength: 1,
            maxLength: 256,
            maxGraphemes: 2560,
            description: 'The name of the track',
          },
          trackMbId: {
            type: 'string',
            description: 'The Musicbrainz ID of the track',
          },
          recordingMbId: {
            type: 'string',
            description: 'The Musicbrainz recording ID of the track',
          },
          duration: {
            type: 'integer',
            description: 'The length of the track in seconds',
          },
          artists: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:fm.teal.alpha.feed.defs#artist',
            },
            description: 'Array of artists in order of original appearance.',
          },
          releaseName: {
            type: 'string',
            maxLength: 256,
            maxGraphemes: 2560,
            description: 'The name of the release/album',
          },
          releaseMbId: {
            type: 'string',
            description: 'The Musicbrainz release ID',
          },
          isrc: {
            type: 'string',
            description: 'The ISRC code associated with the recording',
          },
          originUrl: {
            type: 'string',
            description: 'The URL associated with this track',
          },
          musicServiceBaseDomain: {
            type: 'string',
            description:
              "The base domain of the music service. e.g. music.apple.com, tidal.com, spotify.com. Defaults to 'local' if not provided.",
          },
          submissionClientAgent: {
            type: 'string',
            maxLength: 256,
            maxGraphemes: 2560,
            description:
              "A user-agent style string specifying the user agent. e.g. tealtracker/0.0.1b (Linux; Android 13; SM-A715F). Defaults to 'manual/unknown' if not provided.",
          },
          playedTime: {
            type: 'string',
            format: 'datetime',
            description: 'The unix timestamp of when the track was played',
          },
        },
      },
      artist: {
        type: 'object',
        required: ['artistName'],
        properties: {
          artistName: {
            type: 'string',
            minLength: 1,
            maxLength: 256,
            maxGraphemes: 2560,
            description: 'The name of the artist',
          },
          artistMbId: {
            type: 'string',
            description: 'The Musicbrainz ID of the artist',
          },
        },
      },
    },
  },
  FmTealAlphaFeedGetActorFeed: {
    lexicon: 1,
    id: 'fm.teal.alpha.feed.getActorFeed',
    description:
      "This lexicon is in a not officially released state. It is subject to change. | Retrieves multiple plays from the index or via an author's DID.",
    defs: {
      main: {
        type: 'query',
        parameters: {
          type: 'params',
          required: ['authorDID'],
          properties: {
            authorDID: {
              type: 'string',
              format: 'at-identifier',
              description: "The author's DID for the play",
            },
            cursor: {
              type: 'string',
              description: 'The cursor to start the query from',
            },
            limit: {
              type: 'integer',
              description:
                'The upper limit of tracks to get per request. Default is 20, max is 50.',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['plays'],
            properties: {
              plays: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:fm.teal.alpha.feed.defs#playView',
                },
              },
            },
          },
        },
      },
    },
  },
  FmTealAlphaFeedGetPlay: {
    lexicon: 1,
    id: 'fm.teal.alpha.feed.getPlay',
    description:
      'This lexicon is in a not officially released state. It is subject to change. | Retrieves a play given an author DID and record key.',
    defs: {
      main: {
        type: 'query',
        parameters: {
          type: 'params',
          required: ['authorDID', 'rkey'],
          properties: {
            authorDID: {
              type: 'string',
              format: 'at-identifier',
              description: "The author's DID for the play",
            },
            rkey: {
              type: 'string',
              description: 'The record key of the play',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['play'],
            properties: {
              play: {
                type: 'ref',
                ref: 'lex:fm.teal.alpha.feed.defs#playView',
              },
            },
          },
        },
      },
    },
  },
  FmTealAlphaFeedPlay: {
    lexicon: 1,
    id: 'fm.teal.alpha.feed.play',
    description:
      "This lexicon is in a not officially released state. It is subject to change. | A declaration of a teal.fm play. Plays are submitted as a result of a user listening to a track. Plays should be marked as tracked when a user has listened to the entire track if it's under 2 minutes long, or half of the track's duration up to 4 minutes, whichever is longest.",
    defs: {
      main: {
        type: 'record',
        key: 'tid',
        record: {
          type: 'object',
          required: ['trackName'],
          properties: {
            trackName: {
              type: 'string',
              minLength: 1,
              maxLength: 256,
              maxGraphemes: 2560,
              description: 'The name of the track',
            },
            trackMbId: {
              type: 'string',
              description: 'The Musicbrainz ID of the track',
            },
            recordingMbId: {
              type: 'string',
              description: 'The Musicbrainz recording ID of the track',
            },
            duration: {
              type: 'integer',
              description: 'The length of the track in seconds',
            },
            artistNames: {
              type: 'array',
              items: {
                type: 'string',
                minLength: 1,
                maxLength: 256,
                maxGraphemes: 2560,
              },
              description:
                "Array of artist names in order of original appearance. Prefer using 'artists'.",
            },
            artistMbIds: {
              type: 'array',
              items: {
                type: 'string',
              },
              description:
                "Array of Musicbrainz artist IDs. Prefer using 'artists'.",
            },
            artists: {
              type: 'array',
              items: {
                type: 'ref',
                ref: 'lex:fm.teal.alpha.feed.defs#artist',
              },
              description: 'Array of artists in order of original appearance.',
            },
            releaseName: {
              type: 'string',
              maxLength: 256,
              maxGraphemes: 2560,
              description: 'The name of the release/album',
            },
            releaseMbId: {
              type: 'string',
              description: 'The Musicbrainz release ID',
            },
            isrc: {
              type: 'string',
              description: 'The ISRC code associated with the recording',
            },
            originUrl: {
              type: 'string',
              description: 'The URL associated with this track',
            },
            musicServiceBaseDomain: {
              type: 'string',
              description:
                "The base domain of the music service. e.g. music.apple.com, tidal.com, spotify.com. Defaults to 'local' if unavailable or not provided.",
            },
            submissionClientAgent: {
              type: 'string',
              maxLength: 256,
              maxGraphemes: 2560,
              description:
                "A metadata string specifying the user agent where the format is `<app-identifier>/<version> (<kernel/OS-base>; <platform/OS-version>; <device-model>)`. If string is provided, only `app-identifier` and `version` are required. `app-identifier` is recommended to be in reverse dns format. Defaults to 'manual/unknown' if unavailable or not provided.",
            },
            playedTime: {
              type: 'string',
              format: 'datetime',
              description: 'The unix timestamp of when the track was played',
            },
            trackDiscriminant: {
              type: 'string',
              maxLength: 128,
              maxGraphemes: 1280,
              description:
                "Distinguishing information for track variants (e.g. 'Acoustic Version', 'Live at Wembley', 'Radio Edit', 'Demo'). Used to differentiate between different versions of the same base track while maintaining grouping capabilities.",
            },
            releaseDiscriminant: {
              type: 'string',
              maxLength: 128,
              maxGraphemes: 1280,
              description:
                "Distinguishing information for release variants (e.g. 'Deluxe Edition', 'Remastered', '2023 Remaster', 'Special Edition'). Used to differentiate between different versions of the same base release while maintaining grouping capabilities.",
            },
          },
        },
      },
    },
  },
  FmTealAlphaStatsDefs: {
    lexicon: 1,
    id: 'fm.teal.alpha.stats.defs',
    defs: {
      artistView: {
        type: 'object',
        required: ['mbid', 'name', 'playCount'],
        properties: {
          mbid: {
            type: 'string',
            description: 'MusicBrainz artist ID',
          },
          name: {
            type: 'string',
            description: 'Artist name',
          },
          playCount: {
            type: 'integer',
            description: 'Total number of plays for this artist',
          },
        },
      },
      releaseView: {
        type: 'object',
        required: ['mbid', 'name', 'playCount'],
        properties: {
          mbid: {
            type: 'string',
            description: 'MusicBrainz release ID',
          },
          name: {
            type: 'string',
            description: 'Release/album name',
          },
          playCount: {
            type: 'integer',
            description: 'Total number of plays for this release',
          },
        },
      },
      recordingView: {
        type: 'object',
        required: ['mbid', 'name', 'playCount'],
        properties: {
          mbid: {
            type: 'string',
            description: 'MusicBrainz recording ID',
          },
          name: {
            type: 'string',
            description: 'Recording/track name',
          },
          playCount: {
            type: 'integer',
            description: 'Total number of plays for this recording',
          },
        },
      },
    },
  },
  FmTealAlphaStatsGetLatest: {
    lexicon: 1,
    id: 'fm.teal.alpha.stats.getLatest',
    defs: {
      main: {
        type: 'query',
        description: 'Get latest plays globally',
        parameters: {
          type: 'params',
          properties: {
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 50,
              description: 'Number of latest plays to return',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['plays'],
            properties: {
              plays: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:fm.teal.alpha.feed.defs#playView',
                },
              },
            },
          },
        },
      },
    },
  },
  FmTealAlphaStatsGetTopArtists: {
    lexicon: 1,
    id: 'fm.teal.alpha.stats.getTopArtists',
    description: 'Get top artists by play count',
    defs: {
      main: {
        type: 'query',
        parameters: {
          type: 'params',
          properties: {
            period: {
              type: 'string',
              enum: ['all', '30days', '7days'],
              default: 'all',
              description: 'Time period for top artists',
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 50,
              description: 'Number of artists to return',
            },
            cursor: {
              type: 'string',
              description: 'Pagination cursor',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['artists'],
            properties: {
              artists: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:fm.teal.alpha.stats.defs#artistView',
                },
              },
              cursor: {
                type: 'string',
                description: 'Next page cursor',
              },
            },
          },
        },
      },
    },
  },
  FmTealAlphaStatsGetTopReleases: {
    lexicon: 1,
    id: 'fm.teal.alpha.stats.getTopReleases',
    description: 'Get top releases/albums by play count',
    defs: {
      main: {
        type: 'query',
        parameters: {
          type: 'params',
          properties: {
            period: {
              type: 'string',
              enum: ['all', '30days', '7days'],
              default: 'all',
              description: 'Time period for top releases',
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 50,
              description: 'Number of releases to return',
            },
            cursor: {
              type: 'string',
              description: 'Pagination cursor',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['releases'],
            properties: {
              releases: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:fm.teal.alpha.stats.defs#releaseView',
                },
              },
              cursor: {
                type: 'string',
                description: 'Next page cursor',
              },
            },
          },
        },
      },
    },
  },
  FmTealAlphaStatsGetUserTopArtists: {
    lexicon: 1,
    id: 'fm.teal.alpha.stats.getUserTopArtists',
    description: "Get a user's top artists by play count",
    defs: {
      main: {
        type: 'query',
        parameters: {
          type: 'params',
          required: ['actor'],
          properties: {
            actor: {
              type: 'string',
              format: 'at-identifier',
              description: "The user's DID or handle",
            },
            period: {
              type: 'string',
              enum: ['30days', '7days'],
              default: '30days',
              description: 'Time period for top artists',
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 50,
              description: 'Number of artists to return',
            },
            cursor: {
              type: 'string',
              description: 'Pagination cursor',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['artists'],
            properties: {
              artists: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:fm.teal.alpha.stats.defs#artistView',
                },
              },
              cursor: {
                type: 'string',
                description: 'Next page cursor',
              },
            },
          },
        },
      },
    },
  },
  FmTealAlphaStatsGetUserTopReleases: {
    lexicon: 1,
    id: 'fm.teal.alpha.stats.getUserTopReleases',
    description: "Get a user's top releases/albums by play count",
    defs: {
      main: {
        type: 'query',
        parameters: {
          type: 'params',
          required: ['actor'],
          properties: {
            actor: {
              type: 'string',
              format: 'at-identifier',
              description: "The user's DID or handle",
            },
            period: {
              type: 'string',
              enum: ['30days', '7days'],
              default: '30days',
              description: 'Time period for top releases',
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 50,
              description: 'Number of releases to return',
            },
            cursor: {
              type: 'string',
              description: 'Pagination cursor',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['releases'],
            properties: {
              releases: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:fm.teal.alpha.stats.defs#releaseView',
                },
              },
              cursor: {
                type: 'string',
                description: 'Next page cursor',
              },
            },
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)

export function validate<T extends { $type: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType: true,
): ValidationResult<T>
export function validate<T extends { $type?: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: false,
): ValidationResult<T>
export function validate(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: boolean,
): ValidationResult {
  return (requiredType ? is$typed : maybe$typed)(v, id, hash)
    ? lexicons.validate(`${id}#${hash}`, v)
    : {
        success: false,
        error: new ValidationError(
          `Must be an object with "${hash === 'main' ? id : `${id}#${hash}`}" $type property`,
        ),
      }
}

export const ids = {
  FmTealAlphaActorDefs: 'fm.teal.alpha.actor.defs',
  FmTealAlphaActorGetProfile: 'fm.teal.alpha.actor.getProfile',
  FmTealAlphaActorGetProfiles: 'fm.teal.alpha.actor.getProfiles',
  FmTealAlphaActorProfile: 'fm.teal.alpha.actor.profile',
  FmTealAlphaActorProfileStatus: 'fm.teal.alpha.actor.profileStatus',
  FmTealAlphaActorSearchActors: 'fm.teal.alpha.actor.searchActors',
  FmTealAlphaActorStatus: 'fm.teal.alpha.actor.status',
  FmTealAlphaFeedDefs: 'fm.teal.alpha.feed.defs',
  FmTealAlphaFeedGetActorFeed: 'fm.teal.alpha.feed.getActorFeed',
  FmTealAlphaFeedGetPlay: 'fm.teal.alpha.feed.getPlay',
  FmTealAlphaFeedPlay: 'fm.teal.alpha.feed.play',
  FmTealAlphaStatsDefs: 'fm.teal.alpha.stats.defs',
  FmTealAlphaStatsGetLatest: 'fm.teal.alpha.stats.getLatest',
  FmTealAlphaStatsGetTopArtists: 'fm.teal.alpha.stats.getTopArtists',
  FmTealAlphaStatsGetTopReleases: 'fm.teal.alpha.stats.getTopReleases',
  FmTealAlphaStatsGetUserTopArtists: 'fm.teal.alpha.stats.getUserTopArtists',
  FmTealAlphaStatsGetUserTopReleases: 'fm.teal.alpha.stats.getUserTopReleases',
} as const

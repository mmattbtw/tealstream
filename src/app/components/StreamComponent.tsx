"use client";

import { JetstreamSubscription } from "@atcute/jetstream";
import { useEffect, useRef, useState } from "react";
import { FmTealAlphaFeedPlay } from "../../../lexiconTypes";

interface StreamRecord {
  id: string;
  playData: FmTealAlphaFeedPlay.Record;
  timestamp: Date;
  author: string;
  profile?: {
    handle?: string;
    displayName?: string;
    avatar?: string;
  };
  albumCover?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  streamer: string;
  createdAt: Date;
  profile?: {
    handle?: string;
    displayName?: string;
    avatar?: string;
  };
}

interface ProfileCache {
  [did: string]: {
    handle?: string;
    displayName?: string;
    avatar?: string;
  };
}

interface TimeseriesData {
  range: string[];
  series: {
    [propertyName: string]: {
      creates: number;
      deletes: number;
      dids_estimate: number;
      updates: number;
    }[];
  };
}

interface CollectionStats {
  totalRecords: number;
  uniqueArtists: number;
  uniqueReleases: number;
  totalDuration: number;
  lastUpdated: string;
  timeseriesData?: TimeseriesData;
}

type TimePeriod = "daily" | "weekly" | "monthly";

export default function StreamComponent() {
  const [records, setRecords] = useState<StreamRecord[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileCache, setProfileCache] = useState<ProfileCache>({});
  const [collectionStats, setCollectionStats] =
    useState<CollectionStats | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("daily");
  const [cycleProgress, setCycleProgress] = useState(0);
  const subscriptionRef = useRef<JetstreamSubscription | null>(null);
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSubscribedRef = useRef<boolean>(false);

  // Target streamer DID for chat filtering
  const TARGET_STREAMER_DID = "did:plc:tas6hj2xjrqben5653v5kohk";

  // Cache for resolved PDS servers
  const pdsCache = useRef<Map<string, string>>(new Map());

  // Time periods in cycling order
  const timePeriods: TimePeriod[] = ["daily", "weekly", "monthly"];

  // Function to cycle to next time period
  const cycleToNextPeriod = () => {
    setTimePeriod((current) => {
      const currentIndex = timePeriods.indexOf(current);
      const nextIndex = (currentIndex + 1) % timePeriods.length;
      return timePeriods[nextIndex];
    });
  };

  // Function to start auto-cycling
  const startAutoCycling = () => {
    if (cycleIntervalRef.current) {
      clearInterval(cycleIntervalRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Reset progress
    setCycleProgress(0);

    // Start progress animation (60 updates per second for smooth animation)
    progressIntervalRef.current = setInterval(() => {
      setCycleProgress((prev) => {
        const newProgress = prev + 100 / (60 * 60); // 60 seconds * 60 updates per second
        return newProgress >= 100 ? 0 : newProgress;
      });
    }, 1000 / 60); // 60 FPS

    // Start cycling every 60 seconds
    cycleIntervalRef.current = setInterval(() => {
      cycleToNextPeriod();
      setCycleProgress(0); // Reset progress after cycle
    }, 60 * 1000);
  };

  // Function to stop auto-cycling
  const stopAutoCycling = () => {
    if (cycleIntervalRef.current) {
      clearInterval(cycleIntervalRef.current);
      cycleIntervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setCycleProgress(0);
  };

  // Function to resolve DID to PDS server
  const resolveDidToPds = async (did: string): Promise<string> => {
    // Check cache first
    if (pdsCache.current.has(did)) {
      return pdsCache.current.get(did)!;
    }

    try {
      if (did.startsWith("did:web:")) {
        // Handle did:web DIDs
        const domain = did.replace("did:web:", "");
        const didDocUrl = `https://${domain}/.well-known/did.json`;

        console.log(`🔍 Resolving did:web DID from ${didDocUrl}`);

        const response = await fetch(didDocUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const didDoc = await response.json();

        // Look for AtprotoPersonalDataServer in the service array
        const atprotoService = didDoc.service?.find(
          (service: any) => service.type === "AtprotoPersonalDataServer"
        );

        if (atprotoService?.serviceEndpoint) {
          const pds = atprotoService.serviceEndpoint;
          pdsCache.current.set(did, pds);
          console.log(`🔍 Resolved ${did} to PDS: ${pds}`);
          return pds;
        } else {
          throw new Error("No AtprotoPersonalDataServer found in DID document");
        }
      } else if (did.startsWith("did:plc:")) {
        // Handle did:plc DIDs through PLC directory
        const plcUrl = `https://plc.directory/${did}`;

        console.log(`🔍 Resolving did:plc DID from ${plcUrl}`);

        const response = await fetch(plcUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const didDoc = await response.json();

        // Look for AtprotoPersonalDataServer in the service array
        const atprotoService = didDoc.service?.find(
          (service: any) => service.type === "AtprotoPersonalDataServer"
        );

        if (atprotoService?.serviceEndpoint) {
          const pds = atprotoService.serviceEndpoint;
          pdsCache.current.set(did, pds);
          console.log(`🔍 Resolved ${did} to PDS: ${pds}`);
          return pds;
        } else {
          throw new Error("No AtprotoPersonalDataServer found in DID document");
        }
      } else {
        // Handle other DIDs using the identity resolution endpoint
        const response = await fetch(
          `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(did)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const pds = data.pds || "https://bsky.social";
        pdsCache.current.set(did, pds);
        console.log(`🔍 Resolved ${did} to PDS: ${pds}`);
        return pds;
      }
    } catch (error) {
      console.log(`⚠️  Failed to resolve ${did}, using default PDS: ${error}`);
      const defaultPds = "https://bsky.social";
      pdsCache.current.set(did, defaultPds);
      return defaultPds;
    }
  };

  // Function to resolve profile information
  const resolveProfile = async (did: string): Promise<ProfileCache[string]> => {
    if (profileCache[did]) {
      return profileCache[did];
    }

    try {
      // Resolve the DID to get the correct PDS server
      const pds = await resolveDidToPds(did);

      // Get the profile record from their repository
      const response = await fetch(
        `${pds}/xrpc/com.atproto.repo.getRecord?repo=${encodeURIComponent(did)}&collection=app.bsky.actor.profile&rkey=self`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const profileData = data.value;

      // Try to resolve the handle from the DID
      let handle = did; // fallback to DID
      try {
        if (did.startsWith("did:web:")) {
          // For did:web DIDs, get the handle from the DID document
          const domain = did.replace("did:web:", "");
          const didDocUrl = `https://${domain}/.well-known/did.json`;

          const handleResponse = await fetch(didDocUrl);
          if (handleResponse.ok) {
            const didDoc = await handleResponse.json();
            // Extract handle from alsoKnownAs field (e.g., "at://web.mmatt.net")
            const atProtoHandle = didDoc.alsoKnownAs?.find((aka: string) =>
              aka.startsWith("at://")
            );
            if (atProtoHandle) {
              handle = atProtoHandle.replace("at://", "");
            }
          }
        } else if (did.startsWith("did:plc:")) {
          // For did:plc DIDs, get the handle from the PLC directory
          const plcUrl = `https://plc.directory/${did}`;

          const handleResponse = await fetch(plcUrl);
          if (handleResponse.ok) {
            const didDoc = await handleResponse.json();
            // Extract handle from alsoKnownAs field (e.g., "at://example.bsky.app")
            const atProtoHandle = didDoc.alsoKnownAs?.find((aka: string) =>
              aka.startsWith("at://")
            );
            if (atProtoHandle) {
              handle = atProtoHandle.replace("at://", "");
            }
          }
        } else {
          // For other DIDs, use the identity resolution endpoint
          const handleResponse = await fetch(
            `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?did=${encodeURIComponent(did)}`
          );
          if (handleResponse.ok) {
            const handleData = await handleResponse.json();
            console.log(handleData);
            handle = handleData.handle || did;
          }
        }
      } catch (handleErr) {
        console.warn(`Failed to resolve handle for ${did}:`, handleErr);
      }

      // Handle avatar blob reference
      let avatarUrl: string | undefined;
      if (profileData.avatar) {
        if (typeof profileData.avatar === "string") {
          // Direct URL
          avatarUrl = profileData.avatar;
        } else if (profileData.avatar.ref?.$link) {
          // Blob reference - construct the blob URL
          const cid = profileData.avatar.ref.$link;
          avatarUrl = `${pds}/xrpc/com.atproto.sync.getBlob?did=${encodeURIComponent(did)}&cid=${cid}`;
        }
      }

      const profile = {
        handle: handle,
        displayName: profileData.displayName as string | undefined,
        avatar: avatarUrl,
      };

      console.log(`Resolved profile for ${did}:`, profile);
      setProfileCache((prev) => ({ ...prev, [did]: profile }));
      return profile;
    } catch (err) {
      console.warn(`Failed to resolve profile for ${did}:`, err);
      return {};
    }
  };

  // Function to get album cover from MusicBrainz
  const getAlbumCover = async (
    releaseMbId?: string
  ): Promise<string | undefined> => {
    if (!releaseMbId) return undefined;

    try {
      // First try to get the cover art from Cover Art Archive
      const response = await fetch(
        `https://coverartarchive.org/release/${releaseMbId}/front-250`,
        {
          method: "HEAD", // Just check if it exists
          mode: "cors",
        }
      );

      if (response.ok) {
        return `https://coverartarchive.org/release/${releaseMbId}/front-250`;
      }

      // If front-250 doesn't exist, try the general front image
      const fallbackResponse = await fetch(
        `https://coverartarchive.org/release/${releaseMbId}/front`,
        {
          method: "HEAD",
          mode: "cors",
        }
      );

      if (fallbackResponse.ok) {
        return `https://coverartarchive.org/release/${releaseMbId}/front`;
      }
    } catch (err) {
      console.warn(`Failed to get album cover for ${releaseMbId}:`, err);
    }
    return undefined;
  };

  // Function to get timeseries parameters based on time period
  const getTimeseriesParams = (period: TimePeriod) => {
    const now = new Date();
    const collection = "fm.teal.alpha.feed.play";

    switch (period) {
      case "daily":
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return {
          collection,
          since: oneDayAgo.toISOString(),
          step: 3600, // 1 hour steps
          until: now.toISOString(),
        };
      case "weekly":
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return {
          collection,
          since: oneWeekAgo.toISOString(),
          step: 86400, // 24 hour steps
          until: now.toISOString(),
        };
      case "monthly":
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return {
          collection,
          since: oneMonthAgo.toISOString(),
          step: 86400, // 24 hour steps
          until: now.toISOString(),
        };
      default:
        return {
          collection,
          since: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          step: 3600,
          until: now.toISOString(),
        };
    }
  };

  // Function to fetch timeseries data from UFOs API
  const fetchTimeseriesData = async (period: TimePeriod) => {
    try {
      const params = getTimeseriesParams(period);
      const queryString = new URLSearchParams({
        collection: params.collection,
        since: params.since,
        step: params.step.toString(),
        until: params.until,
      }).toString();

      const response = await fetch(
        `https://ufos-api.microcosm.blue/timeseries?${queryString}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: TimeseriesData = await response.json();
      console.log("Timeseries API response:", data);

      // Calculate totals from the timeseries data
      const collectionKey = params.collection;
      const seriesData = data.series[collectionKey] || [];

      const totalRecords = seriesData.reduce(
        (sum, point) => sum + point.creates,
        0
      );
      const totalDeletes = seriesData.reduce(
        (sum, point) => sum + point.deletes,
        0
      );
      const uniqueArtists =
        seriesData.length > 0
          ? seriesData[seriesData.length - 1].dids_estimate
          : 0;

      const stats: CollectionStats = {
        totalRecords,
        uniqueArtists,
        uniqueReleases: 0, // Not available in this API response
        totalDuration: 0, // Not available in this API response
        lastUpdated: new Date().toISOString(),
        timeseriesData: data,
      };

      setCollectionStats(stats);
    } catch (err) {
      console.warn("Failed to fetch timeseries data:", err);
    }
  };

  useEffect(() => {
    const startStream = async () => {
      try {
        setError(null);
        setIsConnected(false);

        // Prevent duplicate subscriptions
        if (isSubscribedRef.current) {
          return;
        }

        const subscription = new JetstreamSubscription({
          url: "wss://jetstream1.us-east.fire.hose.cam/subscribe",
          wantedCollections: [
            "fm.teal.alpha.feed.play",
            "place.stream.chat.message",
          ],
        });

        subscriptionRef.current = subscription;
        isSubscribedRef.current = true;
        setIsConnected(true);

        for await (const event of subscription) {
          if (event.kind === "commit") {
            const commit = event.commit;

            // Handle play records
            if (commit.collection === "fm.teal.alpha.feed.play") {
              if (commit.operation === "create") {
                const record = commit.record as FmTealAlphaFeedPlay.Record;
                const did = event.did || "Unknown";

                const newRecord: StreamRecord = {
                  id: commit.rkey,
                  playData: record,
                  timestamp: new Date(),
                  author: did,
                };

                // Resolve profile and album cover asynchronously
                Promise.all([
                  resolveProfile(did),
                  getAlbumCover(record.releaseMbId),
                ]).then(([profile, albumCover]) => {
                  setRecords((prev) => {
                    const updatedRecords = prev.map((r) =>
                      r.id === commit.rkey ? { ...r, profile, albumCover } : r
                    );
                    return updatedRecords;
                  });
                });

                setRecords((prev) => {
                  const updated = [newRecord, ...prev];
                  // Sort by timestamp (newest first) and keep last 100 records
                  return updated
                    .sort(
                      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
                    )
                    .slice(0, 100);
                });
              }
            }

            // Handle chat messages
            if (commit.collection === "place.stream.chat.message") {
              if (commit.operation === "create") {
                const record = commit.record as any; // Chat message record
                const did = event.did || "Unknown";

                // Only process messages from the target streamer
                if (record.streamer === TARGET_STREAMER_DID) {
                  const newChatMessage: ChatMessage = {
                    id: commit.rkey,
                    text: record.text,
                    streamer: record.streamer,
                    createdAt: new Date(record.createdAt),
                  };

                  // Resolve profile asynchronously
                  resolveProfile(did).then((profile) => {
                    setChatMessages((prev) => {
                      const updatedMessages = prev.map((m) =>
                        m.id === commit.rkey ? { ...m, profile } : m
                      );
                      return updatedMessages;
                    });
                  });

                  setChatMessages((prev) => {
                    const updated = [newChatMessage, ...prev];
                    // Keep last 50 chat messages, sorted by creation time (newest first)
                    return updated
                      .sort(
                        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
                      )
                      .slice(0, 50);
                  });
                }
              }
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setIsConnected(false);
      }
    };

    startStream();

    // Cleanup function
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current = null;
      }
      isSubscribedRef.current = false;
      setIsConnected(false);
      setRecords([]); // Clear records on unmount
      setChatMessages([]); // Clear chat messages on unmount
    };
  }, []);

  // Start auto-cycling on component mount
  useEffect(() => {
    startAutoCycling();

    return () => {
      stopAutoCycling();
    };
  }, []);

  // Fetch timeseries data on component mount and when time period changes
  useEffect(() => {
    fetchTimeseriesData(timePeriod);
  }, [timePeriod]);

  // Refetch data every 5 minutes
  useEffect(() => {
    const statsInterval = setInterval(
      () => {
        fetchTimeseriesData(timePeriod);
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(statsInterval);
  }, [timePeriod]);

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const clearRecords = () => {
    setRecords([]);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Header with connection status and time */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {isConnected ? "LIVE" : "OFFLINE"}
              </span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Teal.fm Play Feed
            </h1>
          </div>

          {/* Time period selector and current time display */}
          <div className="flex items-center gap-6">
            {/* Time period selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex bg-white/10 rounded-lg p-1 relative">
                  {/* Progress bar overlay */}
                  <div
                    className="absolute top-0 left-0 h-full bg-purple-400/30 rounded-lg transition-all duration-100 ease-linear"
                    style={{ width: `${cycleProgress}%` }}
                  />
                  {(["daily", "weekly", "monthly"] as TimePeriod[]).map(
                    (period) => (
                      <div
                        key={period}
                        className={`relative z-10 px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                          timePeriod === period
                            ? "bg-purple-500 text-white shadow-lg"
                            : "text-gray-300"
                        }`}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Current time display */}
            <div className="text-right">
              <div className="text-2xl font-mono font-bold">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-300">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex h-full pt-20">
        {/* Left side - Plays (60% width) */}
        <div className="w-3/5 px-8 py-6">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
            <div className="space-y-4">
              {records.length === 0 && !error && isConnected && (
                <div className="text-center py-20">
                  <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-300 text-lg">Waiting for plays...</p>
                </div>
              )}

              {records.map((record, index) => (
                <div
                  key={record.id}
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 ${
                    index === 0
                      ? "ring-2 ring-purple-400 shadow-lg shadow-purple-400/20"
                      : ""
                  }`}
                >
                  {/* Profile and timestamp */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {record.profile?.avatar ? (
                        <img
                          src={record.profile.avatar}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center border-2 border-white/20">
                          <span className="text-white text-lg font-bold">
                            {record.profile?.displayName?.[0] ||
                              record.author[0] ||
                              "?"}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white text-lg">
                          {record.profile?.displayName ||
                            record.profile?.handle ||
                            "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-300">
                          @{record.profile?.handle || record.author}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-300 font-mono">
                      {record.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Music info with album cover */}
                  <div className="flex items-start space-x-4">
                    {record.albumCover && (
                      <img
                        src={record.albumCover}
                        alt="Album cover"
                        className="w-20 h-20 rounded-lg object-cover shadow-lg border border-white/20"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {record.playData.trackName}
                          </h3>
                          {record.playData.artists &&
                          record.playData.artists.length > 0 ? (
                            <p className="text-purple-200 text-lg">
                              by{" "}
                              {record.playData.artists
                                .map((artist) => artist.artistName)
                                .join(", ")}
                            </p>
                          ) : record.playData.artistNames &&
                            record.playData.artistNames.length > 0 ? (
                            <p className="text-purple-200 text-lg">
                              by {record.playData.artistNames.join(", ")}
                            </p>
                          ) : null}
                        </div>

                        {record.playData.releaseName && (
                          <p className="text-sm text-gray-300">
                            from{" "}
                            <span className="font-semibold text-white">
                              {record.playData.releaseName}
                            </span>
                          </p>
                        )}

                        <div className="flex gap-4 text-xs text-gray-400">
                          {record.playData.duration && (
                            <span>
                              {Math.floor(record.playData.duration / 60)}:
                              {(record.playData.duration % 60)
                                .toString()
                                .padStart(2, "0")}
                            </span>
                          )}
                          {record.playData.musicServiceBaseDomain &&
                            record.playData.musicServiceBaseDomain !==
                              "local" && (
                              <span>
                                via {record.playData.musicServiceBaseDomain}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Collection Stats (40% width) */}
        <div className="w-2/5 px-8 py-6 border-l border-white/10">
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Collection Stats
            </h2>

            {collectionStats ? (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {collectionStats.totalRecords.toLocaleString()}
                  </div>
                  <div className="text-lg text-gray-300">
                    Total Plays ({timePeriod})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                    <div className="text-2xl font-bold text-pink-400 mb-1">
                      {collectionStats.uniqueArtists.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-300">Unique Users</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {records.length}
                    </div>
                    <div className="text-sm text-gray-300">Live Plays</div>
                  </div>
                </div>

                {/* Timeseries Chart */}
                {collectionStats.timeseriesData && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 transition-all duration-500 ease-in-out">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Plays Over Time ({timePeriod})
                    </h3>
                    <div className="h-32 flex items-end justify-between gap-1">
                      {(() => {
                        const collectionKey = "fm.teal.alpha.feed.play";
                        const seriesData =
                          collectionStats.timeseriesData.series[
                            collectionKey
                          ] || [];
                        const maxPlays = Math.max(
                          ...seriesData.map((d) => d.creates),
                          1
                        );

                        return seriesData.map((point, index) => {
                          const height = (point.creates / maxPlays) * 100;
                          return (
                            <div
                              key={`${timePeriod}-${index}`}
                              className="flex-1 bg-gradient-to-t from-purple-500 to-pink-400 rounded-t-sm min-h-[2px] transition-all duration-700 ease-out animate-in slide-in-from-bottom-2"
                              style={{
                                height: `${height}%`,
                                animationDelay: `${index * 50}ms`,
                              }}
                              title={`${new Date(collectionStats.timeseriesData!.range[index]).toLocaleString()}: ${point.creates} plays`}
                            />
                          );
                        });
                      })()}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 transition-all duration-300">
                      <span>
                        {collectionStats.timeseriesData.range[0]
                          ? new Date(
                              collectionStats.timeseriesData.range[0]
                            ).toLocaleDateString()
                          : "Start"}
                      </span>
                      <span>
                        {collectionStats.timeseriesData.range[
                          collectionStats.timeseriesData.range.length - 1
                        ]
                          ? new Date(
                              collectionStats.timeseriesData.range[
                                collectionStats.timeseriesData.range.length - 1
                              ]
                            ).toLocaleDateString()
                          : "End"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {isConnected ? "LIVE" : "OFFLINE"}
                  </div>
                  <div className="text-lg text-gray-300">Stream Status</div>
                </div>

                <div className="text-xs text-gray-400 mt-auto">
                  Last updated:{" "}
                  {new Date(collectionStats.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading stats...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      {chatMessages.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-h-32 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-400">
              Live Chat
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className="flex-shrink-0 bg-white/10 rounded-lg p-3 min-w-0 max-w-xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.profile?.avatar ? (
                    <img
                      src={message.profile.avatar}
                      alt="Profile"
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {message.profile?.displayName?.[0] || "?"}
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-gray-300 font-medium">
                    {message.profile?.displayName ||
                      message.profile?.handle ||
                      "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {message.createdAt.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-white text-sm">{message.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 backdrop-blur-sm border border-red-400 rounded-lg p-4">
          <p className="text-white font-medium">Connection Error:</p>
          <p className="text-red-100">{error}</p>
        </div>
      )}
    </div>
  );
}

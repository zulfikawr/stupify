export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  type: string;
  uri: string;
  href: string;
  followers: {
    total: number;
  };
  popularity: number;
  genres: string[];
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  type: string;
  uri: string;
  href: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  type: string;
  uri: string;
  href: string;
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
}

export interface CurrentlyPlayingResponse {
  timestamp: number;
  context: {
    uri: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    type: string;
  } | null;
  progress_ms: number;
  item: SpotifyTrack | null;
  currently_playing_type: string;
  is_playing: boolean;
}

export interface RecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
  context: {
    uri: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    type: string;
  } | null;
}

export interface RecentlyPlayedResponse {
  items: RecentlyPlayedItem[];
  next: string | null;
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  href: string;
}

export interface TimeRangeOptions {
  time_range: "short_term" | "medium_term" | "long_term";
  limit?: number;
}

export interface TopItemsResponse {
  items: (SpotifyTrack | SpotifyArtist)[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

export interface TopTracksResponse {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

export interface TopArtistsResponse {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

export interface PlaylistOwner {
  id: string;
  display_name: string;
  type: string;
  uri: string;
  href: string;
  external_urls: {
    spotify: string;
  };
}

export interface PlaylistTracks {
  href: string;
  total: number;
}

export interface PlaylistItem {
  id: string;
  name: string;
  description: string;
  type: string;
  uri: string;
  href: string;
  images: SpotifyImage[];
  owner: PlaylistOwner;
  tracks: PlaylistTracks;
  collaborative: boolean;
  public: boolean;
  external_urls: {
    spotify: string;
  };
}

export interface PlaylistsResponse {
  items: PlaylistItem[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

export interface TrackItem {
  added_at: string;
  added_by: {
    id: string;
    uri: string;
    href: string;
    type: string;
    external_urls: {
      spotify: string;
    };
  };
  is_local: boolean;
  track: SpotifyTrack;
}

export interface PlaylistResponse {
  id: string;
  name: string;
  description: string;
  type: string;
  uri: string;
  href: string;
  images: SpotifyImage[];
  owner: PlaylistOwner;
  tracks: {
    href: string;
    total: number;
    limit: number;
    offset: number;
    items: TrackItem[];
    next: string | null;
    previous: string | null;
  };
  collaborative: boolean;
  public: boolean;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifySearchResponse {
  tracks?: {
    href: string;
    items: SpotifyTrack[];
    total: number;
  };
  albums?: {
    href: string;
    items: SpotifyAlbum[];
    total: number;
  };
  artists?: {
    href: string;
    items: SpotifyArtist[];
    total: number;
  };
  playlists?: {
    href: string;
    items: PlaylistItem[];
    total: number;
  };
}

import type { Dictionary } from "../i18n";
import { release } from "./release";

export const site = {
  productName: "WaveFlux",
  version: release.version,
  releaseUrl: release.htmlUrl,
  license: "MIT",
  repository: "https://github.com/leocallidus/waveflux",
} as const;

export type NavigationId = keyof Dictionary["navigation"];
export type ScreenshotId = keyof Dictionary["showcase"]["items"];
export type FeatureId = keyof Dictionary["features"]["items"];
export type DownloadId = keyof Dictionary["downloads"]["items"];
export type PlatformId = keyof Dictionary["downloads"]["platforms"];
export type FooterLinkId = keyof Dictionary["footer"]["links"];

export const navigation: ReadonlyArray<{
  id: NavigationId;
  href: `#${string}`;
}> = [
  { id: "showcase", href: "#showcase" },
  { id: "features", href: "#features" },
  { id: "downloads", href: "#downloads" },
  { id: "openSource", href: "#open-source" },
];

export const screenshots: ReadonlyArray<{
  id: ScreenshotId;
  fileName: string;
  width: number;
  height: number;
  priority?: boolean;
}> = [
  {
    id: "mainPlayer",
    fileName: "main-player-window.png",
    width: 1207,
    height: 844,
    priority: true,
  },
  { id: "settings", fileName: "settings-dialog.png", width: 777, height: 701 },
  { id: "compact", fileName: "compact-skin.png", width: 521, height: 477 },
];

export type IconName =
  | "waveform"
  | "playback"
  | "module"
  | "equalizer"
  | "playlist"
  | "download"
  | "convert"
  | "tag"
  | "library"
  | "desktop"
  | "appearance"
  | "language";

export const features: ReadonlyArray<{
  id: FeatureId;
  icon: IconName;
}> = [
  { id: "waveform", icon: "waveform" },
  { id: "playback", icon: "playback" },
  { id: "trackers", icon: "module" },
  { id: "equalizer", icon: "equalizer" },
  { id: "playlists", icon: "playlist" },
  { id: "urlImport", icon: "download" },
  { id: "converter", icon: "convert" },
  { id: "tags", icon: "tag" },
  { id: "library", icon: "library" },
  { id: "desktop", icon: "desktop" },
  { id: "appearance", icon: "appearance" },
  { id: "languages", icon: "language" },
];

export const downloads: ReadonlyArray<{
  id: DownloadId;
  platform: PlatformId;
}> = [
  { id: "windowsMsi", platform: "windows" },
  { id: "windowsPortable", platform: "windows" },
  { id: "appImage", platform: "linux" },
  { id: "debian", platform: "linux" },
  { id: "rpm", platform: "linux" },
  { id: "arch", platform: "linux" },
];

export const footerLinks: ReadonlyArray<{
  id: FooterLinkId;
  href: string;
}> = [
  { id: "github", href: site.repository },
  { id: "releases", href: site.releaseUrl },
  { id: "readme", href: `${site.repository}#readme` },
  { id: "license", href: `${site.repository}/blob/main/LICENSE` },
];

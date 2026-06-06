import releaseData from "./release.json";

export type ReleaseAsset = {
  name: string;
  url: string;
  size: number;
  digest: string | null;
  contentType: string | null;
  downloadCount: number;
  updatedAt: string | null;
};

export type ReleaseDownloadId =
  | "windowsMsi"
  | "windowsPortable"
  | "appImage"
  | "debian"
  | "rpm"
  | "arch";

export type ReleaseData = {
  schemaVersion: 1;
  source: "github" | "fallback";
  generatedAt: string;
  repository: string;
  version: string;
  tagName: string;
  name: string;
  publishedAt: string | null;
  htmlUrl: string;
  assets: ReleaseAsset[];
  downloads: Partial<Record<ReleaseDownloadId, string>>;
};

export const release = releaseData as ReleaseData;

export function getReleaseAsset(
  assetName: string | undefined,
): ReleaseAsset | undefined {
  if (!assetName) return undefined;
  return release.assets.find((asset) => asset.name === assetName);
}

export function getDownloadAsset(
  id: ReleaseDownloadId,
): ReleaseAsset | undefined {
  return getReleaseAsset(release.downloads[id]);
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";

  const units = ["B", "KB", "MB", "GB"] as const;
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${
    units[unitIndex]
  }`;
}

export function shortDigest(digest: string | null): string | null {
  if (!digest) return null;
  const [algorithm, value] = digest.split(":");
  if (!algorithm || !value) return digest;
  return `${algorithm}:${value.slice(0, 12)}`;
}

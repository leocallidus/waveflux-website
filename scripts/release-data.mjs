import { readFile } from "node:fs/promises";

export const repository = "leocallidus/waveflux";
export const fallbackPath = new URL(
  "../src/content/release.fallback.json",
  import.meta.url,
);
export const generatedPath = new URL(
  "../src/content/release.json",
  import.meta.url,
);

export const downloadIds = [
  "windowsMsi",
  "windowsPortable",
  "appImage",
  "debian",
  "rpm",
  "arch",
];

const assetMatchers = {
  windowsMsi: [/^WaveFlux-\d+\.\d+\.\d+-windows-x64\.msi$/i],
  windowsPortable: [/^WaveFlux-\d+\.\d+\.\d+-windows-portable\.zip$/i],
  appImage: [/^WaveFlux-\d+\.\d+\.\d+-[\w.-]+\.AppImage$/],
  debian: [/^waveflux_\d+\.\d+\.\d+-[\w.]+_[\w.-]+\.deb$/i],
  rpm: [/^waveflux-\d+\.\d+\.\d+-.*\.rpm$/i],
  arch: [/^waveflux-\d+\.\d+\.\d+-.*\.pkg\.tar\.zst$/i],
};

export async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

export async function readProjectVersion() {
  const cmake = await readFile(
    new URL("../../CMakeLists.txt", import.meta.url),
    "utf8",
  );
  const match = cmake.match(
    /project\s*\(\s*waveflux\s+VERSION\s+([0-9]+(?:\.[0-9]+){1,3})/i,
  );

  if (!match) {
    throw new Error(
      "Unable to read project(waveflux VERSION ...) from CMakeLists.txt",
    );
  }

  return match[1];
}

export function normalizeVersion(tagName) {
  return String(tagName).replace(/^v/i, "");
}

export function normalizeRelease(release, source = "github") {
  const assets = (release.assets ?? [])
    .filter((asset) => asset?.name && asset?.browser_download_url)
    .map((asset) => ({
      name: asset.name,
      url: asset.browser_download_url,
      size: Number(asset.size ?? 0),
      digest: typeof asset.digest === "string" ? asset.digest : null,
      contentType: asset.content_type ?? null,
      downloadCount: Number(asset.download_count ?? 0),
      updatedAt: asset.updated_at ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const downloads = mapDownloads(assets);

  return {
    schemaVersion: 1,
    source,
    generatedAt: new Date().toISOString(),
    repository,
    version: normalizeVersion(release.tag_name),
    tagName: release.tag_name,
    name: release.name || release.tag_name,
    publishedAt: release.published_at ?? null,
    htmlUrl: release.html_url,
    assets,
    downloads,
  };
}

export function normalizeFallback(fallback) {
  return {
    ...fallback,
    source: "fallback",
    generatedAt: new Date().toISOString(),
  };
}

export function mapDownloads(assets) {
  const entries = {};

  for (const id of downloadIds) {
    const matchers = assetMatchers[id];
    const asset = assets.find((candidate) =>
      matchers.some((matcher) => matcher.test(candidate.name)),
    );

    if (asset) {
      entries[id] = asset.name;
    }
  }

  return entries;
}

export function validateReleaseData(
  data,
  { projectVersion, requireAllDownloads = true } = {},
) {
  const errors = [];
  const names = new Set((data.assets ?? []).map((asset) => asset.name));

  if (data.schemaVersion !== 1) {
    errors.push("schemaVersion must be 1");
  }

  if (data.repository !== repository) {
    errors.push(`repository must be ${repository}`);
  }

  if (!data.version) {
    errors.push("version is required");
  }

  if (projectVersion && data.version !== projectVersion) {
    errors.push(
      `release version ${data.version} does not match CMake project version ${projectVersion}`,
    );
  }

  if (!data.tagName || normalizeVersion(data.tagName) !== data.version) {
    errors.push("tagName must match version");
  }

  if (
    !data.htmlUrl ||
    !data.htmlUrl.startsWith(`https://github.com/${repository}/releases/`)
  ) {
    errors.push("htmlUrl must point to the WaveFlux GitHub release");
  }

  if (!Array.isArray(data.assets) || data.assets.length === 0) {
    errors.push("assets must be a non-empty array");
  }

  for (const asset of data.assets ?? []) {
    if (!asset.name) errors.push("asset.name is required");
    if (
      !asset.url?.startsWith(
        `https://github.com/${repository}/releases/download/`,
      )
    ) {
      errors.push(
        `${asset.name}: asset url must point to a GitHub release download`,
      );
    }
    if (!Number.isFinite(asset.size) || asset.size <= 0) {
      errors.push(`${asset.name}: asset size must be positive`);
    }
  }

  for (const id of downloadIds) {
    const assetName = data.downloads?.[id];

    if (!assetName) {
      if (requireAllDownloads) errors.push(`downloads.${id} is missing`);
      continue;
    }

    if (!names.has(assetName)) {
      errors.push(`downloads.${id} references missing asset ${assetName}`);
    }
  }

  return errors;
}

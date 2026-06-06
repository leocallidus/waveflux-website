import { writeFile } from "node:fs/promises";
import {
  fallbackPath,
  generatedPath,
  normalizeFallback,
  normalizeRelease,
  readJson,
  readProjectVersion,
  repository,
  validateReleaseData,
} from "./release-data.mjs";

async function fetchLatestRelease() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "waveflux-website-release-generator",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${repository}/releases/latest`,
    {
      headers,
    },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub Releases API returned ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

async function main() {
  const fallback = await readJson(fallbackPath);
  const projectVersion = await readProjectVersion();
  let data;

  if (process.env.WAVEFLUX_RELEASE_OFFLINE === "1") {
    data = normalizeFallback(fallback);
    console.warn(
      "Using fallback release data because WAVEFLUX_RELEASE_OFFLINE=1.",
    );
  } else {
    try {
      data = normalizeRelease(await fetchLatestRelease(), "github");
    } catch (error) {
      data = normalizeFallback(fallback);
      console.warn(
        `Using fallback release data because GitHub Releases API fetch failed: ${error.message}`,
      );
    }
  }

  const errors = validateReleaseData(data, { projectVersion });
  if (errors.length > 0) {
    if (data.source !== "fallback") {
      const fallbackData = normalizeFallback(fallback);
      const fallbackErrors = validateReleaseData(fallbackData, {
        projectVersion,
      });

      if (fallbackErrors.length === 0) {
        data = fallbackData;
        console.warn(
          `Using fallback release data because fetched data failed validation:\n${errors.join("\n")}`,
        );
      } else {
        throw new Error(
          `Fetched release data failed validation:\n${errors.join(
            "\n",
          )}\nFallback data also failed validation:\n${fallbackErrors.join("\n")}`,
        );
      }
    } else {
      throw new Error(
        `Fallback release data failed validation:\n${errors.join("\n")}`,
      );
    }
  }

  await writeFile(generatedPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(
    `Generated ${new URL(generatedPath).pathname} from ${data.source} release ${data.tagName}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

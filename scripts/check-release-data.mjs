import {
  generatedPath,
  readJson,
  readProjectVersion,
  validateReleaseData,
} from "./release-data.mjs";

const data = await readJson(generatedPath);
const projectVersion = await readProjectVersion();
const errors = validateReleaseData(data, { projectVersion });

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Release data verified: ${data.tagName}, ${data.assets.length} assets, ${
      Object.keys(data.downloads).length
    } mapped downloads.`,
  );
}

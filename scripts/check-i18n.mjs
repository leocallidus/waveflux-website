import { readFile } from "node:fs/promises";

const localeNames = ["en", "ru"];
const locales = Object.fromEntries(
  await Promise.all(
    localeNames.map(async (locale) => [
      locale,
      JSON.parse(
        await readFile(new URL(`../src/i18n/${locale}.json`, import.meta.url)),
      ),
    ]),
  ),
);

function valueKind(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function collectEntries(value, path = "") {
  const entries = new Map();

  if (valueKind(value) !== "object") {
    entries.set(path, value);
    return entries;
  }

  for (const [key, child] of Object.entries(value)) {
    const childPath = path ? `${path}.${key}` : key;
    entries.set(childPath, child);

    if (valueKind(child) === "object") {
      for (const [nestedPath, nestedValue] of collectEntries(
        child,
        childPath,
      )) {
        entries.set(nestedPath, nestedValue);
      }
    }
  }

  return entries;
}

function placeholders(value) {
  if (typeof value !== "string") return [];
  return [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
}

const reference = collectEntries(locales.en);
const errors = [];

for (const locale of localeNames.slice(1)) {
  const candidate = collectEntries(locales[locale]);

  for (const [path, referenceValue] of reference) {
    if (!candidate.has(path)) {
      errors.push(`${locale}: missing key "${path}"`);
      continue;
    }

    const candidateValue = candidate.get(path);
    if (valueKind(referenceValue) !== valueKind(candidateValue)) {
      errors.push(`${locale}: type mismatch at "${path}"`);
      continue;
    }

    const expectedPlaceholders = placeholders(referenceValue);
    const actualPlaceholders = placeholders(candidateValue);
    if (expectedPlaceholders.join(",") !== actualPlaceholders.join(",")) {
      errors.push(`${locale}: placeholder mismatch at "${path}"`);
    }
  }

  for (const path of candidate.keys()) {
    if (!reference.has(path)) {
      errors.push(`${locale}: unexpected key "${path}"`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Locale parity verified: ${localeNames.join(", ")}`);
}

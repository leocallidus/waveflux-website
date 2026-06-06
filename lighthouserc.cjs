const base = process.env.LHCI_BASE_PATH ?? "";

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      startServerCommand: "npm run preview -- --host 127.0.0.1",
      startServerReadyPattern: "Local",
      url: [
        `http://127.0.0.1:4321${base}/`,
        `http://127.0.0.1:4321${base}/ru/`,
      ],
      settings: {
        chromeFlags: "--headless=new --no-sandbox",
        preset: "desktop",
        throttlingMethod: "provided",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouse-ci",
    },
  },
};

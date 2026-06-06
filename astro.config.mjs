import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "waveflux";
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER ?? "leocallidus";
const isPagesBuild = process.env.GITHUB_ACTIONS === "true";

const devStyleguide = {
  name: "waveflux-dev-styleguide",
  hooks: {
    "astro:config:setup": ({ command, injectRoute }) => {
      if (command === "dev") {
        injectRoute({
          pattern: "/styleguide",
          entrypoint: new URL(
            "./src/styleguide/StyleguidePage.astro",
            import.meta.url,
          ),
          prerender: true,
        });
      }
    },
  },
};

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? `https://${repositoryOwner}.github.io`,
  base: isPagesBuild ? `/${repoName}` : "/",
  integrations: [tailwind(), sitemap(), devStyleguide],
});

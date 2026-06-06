import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL("https://leocallidus.github.io");
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const sitemapUrl = new URL(`${base}/sitemap-index.xml`, siteUrl).toString();

  return new Response(
    ["User-agent: *", "Allow: /", `Sitemap: ${sitemapUrl}`, ""].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};

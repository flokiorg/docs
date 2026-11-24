// The docs Worker: every request is served from the static build (ASSETS).
// Assets that match are served before this runs; a path with none gets
// Docusaurus's 404.html, like the Caddyfile. The release contract never reads
// wrangler.jsonc, so its not_found_handling can't do this.
export default {
  async fetch(req, env) {
    const res = await env.ASSETS.fetch(req);
    if (res.status !== 404) return res;
    const page = await env.ASSETS.fetch(new URL("/404.html", req.url));
    return new Response(page.body, { status: 404, headers: page.headers });
  },
};

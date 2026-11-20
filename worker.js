// The Worker in front of the static build: every request is served from ASSETS.
// http to https is Cloudflare's "Always Use HTTPS" on the zone, not this code.
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};

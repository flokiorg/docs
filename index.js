// The docs Worker: every request is served from the static build (ASSETS).
// Assets that match are served before this runs; it is the documented entry
// a release Worker needs (main_module), not server code.
export default {
  fetch: (req, env) => env.ASSETS.fetch(req),
};

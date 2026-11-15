# syntax=docker/dockerfile:1
# Bases are pinned by digest: chabka-flokicoin deploys only pinned images.

# Stage 1: Base image.
## Start with a base image containing NodeJS so we can build Docusaurus.
FROM node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a AS base
## Disable colour output from yarn to make logs easier to read.
ENV FORCE_COLOR=0
## Enable corepack.
RUN corepack enable
## Set the working directory to `/opt/docusaurus`.
WORKDIR /opt/docusaurus

# Stage 2a: Development mode.
FROM base AS dev
## Set the working directory to `/opt/docusaurus`.
WORKDIR /opt/docusaurus
## Expose the port that Docusaurus will run on.
EXPOSE 3000
## Run the development server.
CMD [ -d "node_modules" ] && yarn start --host 0.0.0.0 --poll 1000 || yarn install && yarn start --host 0.0.0.0 --poll 1000

# Stage 2b: Production build mode.
FROM base AS prod
## Set the working directory to `/opt/docusaurus`.
WORKDIR /opt/docusaurus
## Copy over the source code.
COPY . /opt/docusaurus/
## Install dependencies with `--immutable` to ensure reproducibility.
RUN yarn install --immutable
## Build the static site.
RUN yarn build

# Stage 3a: Serve with `docusaurus serve`.
FROM prod AS serve
## Expose the port that Docusaurus will run on.
EXPOSE 3000
## Run the production server.
CMD ["yarn", "serve", "--host", "0.0.0.0", "--no-open"]

# Stage 3b: Serve with Caddy.
FROM caddy:2-alpine@sha256:003a97808e781aa9f7e75cc2f43d34d461099031faf5e20faefb9f61126836f0 AS caddy
LABEL org.opencontainers.image.source="nostr://npub1lfwkfe3kt60wa3nqeysmwz3t7h7n3p0zpruqd7yzlqf500rnp68qxzkjuj/grasp.flokicoin.org/docs"

## Copy the Caddyfile.
COPY --from=prod /opt/docusaurus/Caddyfile /etc/caddy/Caddyfile
## Copy the Docusaurus build output.
COPY --from=prod /opt/docusaurus/build /var/docusaurus
## Serve on 8080, for any host name.
EXPOSE 8080

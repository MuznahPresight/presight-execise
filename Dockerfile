FROM node:24.16.0-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable
ENV YARN_ENABLE_SCRIPTS=true
ENV npm_config_nodedir=/usr/local

COPY package.json yarn.lock .yarnrc.yml ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN --mount=type=cache,target=/root/.yarn/berry/cache \
    yarn install --immutable

COPY client ./client
COPY server ./server
RUN yarn workspace presight-client build \
    && yarn workspace presight-server build

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/data/app.db

EXPOSE 3001

CMD ["sh", "-c", "if [ ! -s \"$DB_PATH\" ]; then node server/dist/db/seed.js || exit; fi; exec node server/dist/index.js"]

FROM node:25-alpine3.22 AS builder

# ENV NODE_ENV=production

ARG APP_ENVIRONMENT=production
ENV NODE_ENV=$APP_ENVIRONMENT

# RUN mkdir -p /home/app

WORKDIR /home/app

COPY package*.json pnpm*.yaml ./

RUN npm i -g pnpm && pnpm i --frozen-lockfile

COPY . .
RUN pnpm prisma generate && pnpm build

FROM node:25-alpine3.22

ARG APP_ENVIRONMENT=production
ENV NODE_ENV=$APP_ENVIRONMENT

WORKDIR /home/app

COPY --from=builder /home/app/dist ./dist
COPY --from=builder /home/app/package*.json ./
COPY --from=builder /home/app/pnpm-lock.yaml ./

RUN npm i -g pnpm && pnpm i --frozen-lockfile --production

COPY --from=builder /home/app/node_modules/.prisma ./node_modules/.prisma

USER node

CMD ["pnpm", "start:prod"]

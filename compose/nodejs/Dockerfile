FROM node:25-alpine3.22 AS builder

# RUN mkdir -p /home/app

WORKDIR /home/app

COPY package*.json pnpm*.yaml ./

RUN npm i -g pnpm && pnpm i --frozen-lockfile

COPY . .
RUN pnpm prisma generate && pnpm build

FROM node:25-alpine3.22

WORKDIR /home/app

COPY --from=builder /home/app/dist ./dist
COPY --from=builder /home/app/package*.json ./
COPY --from=builder /home/app/pnpm-lock.yaml ./

RUN npm i -g pnpm && pnpm i --frozen-lockfile --production

COPY --from=builder /home/app/node_modules/.prisma ./node_modules/.prisma

USER node

CMD ["pnpm", "start:prod"]

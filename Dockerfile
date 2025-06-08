FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run compile


FROM node:18-alpine

WORKDIR /usr/src/app


ENV NODE_ENV=production


COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/.sequelizerc ./.sequelizerc
COPY --from=builder /usr/src/app/src/database/migrations ./src/database/migrations

EXPOSE 3000

CMD ["node", "dist/server.js"]
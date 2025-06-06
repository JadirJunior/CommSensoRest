FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run compile


FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/dist ./dist

# COPY --from=builder /usr/src/app/package.json ./package.json
# COPY --from=builder /usr/src/app/package-lock.json ./package-lock.json

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
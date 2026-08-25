FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci

COPY backend backend
COPY packages/shared packages/shared

WORKDIR /app/backend
EXPOSE 3000
CMD ["npx", "tsx", "src/server.ts"]
FROM node:18-alpine AS shared-builder

WORKDIR /shared
COPY packages/shared/package*.json ./
RUN npm install
COPY packages/shared/ ./
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY packages/shared/package.json /shared-pkg/
COPY --from=shared-builder /shared/dist /shared-pkg/dist
RUN npm install --only=production

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

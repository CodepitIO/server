ARG ARCH=
FROM ${ARCH}node:17-alpine AS deps
RUN apk add --no-cache g++ make python3 git
RUN yarn global add node-gyp
WORKDIR /server
COPY package.json ./
RUN yarn

FROM ${ARCH}node:17-alpine AS builder
WORKDIR /server
RUN apk add --no-cache python3
ADD . .
COPY --from=deps /server/node_modules /server/node_modules
RUN rm -rf /server/lib
RUN yarn global add ts-node typescript
RUN npx tsc --outDir lib

FROM ${ARCH}node:17-alpine
LABEL org.opencontainers.image.authors="Gustavo Stor"
RUN yarn global add eslint
RUN apk add --no-cache python3
WORKDIR /server
COPY --from=builder /server/common/* ./
COPY --from=builder /server/public ./
COPY --from=builder /server/node_modules ./
COPY --from=builder /server/package.json ./
CMD node main.js
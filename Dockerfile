FROM node:lts as builder

WORKDIR /app

COPY package.json yarn.lock tsconfig.json .yarnrc.yml ./

RUN yarn install

COPY src src

RUN yarn run build

FROM node:lts-slim as app

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --production

# terrible fix of module name
RUN mv node_modules/JSONStream node_modules/jsonstream

COPY --from=builder /app/build ./build

ENTRYPOINT ["npm", "start"]

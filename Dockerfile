ARG NODE_VERSION=16
ARG ALPINE_VERSION=3.14

# FROM node:${NODE_VERSION} AS deps
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

# WORKDIR /app
# COPY package.json yarn.lock ./
# RUN yarn install --non-interactive



# ARG NODE_VERSION
# ARG ALPINE_VERSION
# FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as build

# WORKDIR /app

# COPY --from=deps /app/node_modules ./node_modules

# COPY . .

# RUN yarn build

# ARG NODE_VERSION
# ARG ALPINE_VERSION
# FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as relese

# COPY --from=build /app/dist ./src
# COPY --from=deps /app/node_modules ./node_modules


# CMD ["node", "dist/main.js"]
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn add glob rimraf

RUN yarn install --dev-dependencies 

COPY . .

RUN npm run build


ARG NODE_VERSION
ARG ALPINE_VERSION
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --prod

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
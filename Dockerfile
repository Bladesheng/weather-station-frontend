FROM node:18.14.2-bullseye-slim as builder
RUN apt-get update && apt-get upgrade -y

RUN mkdir /app
WORKDIR /app

# get dependencies first separately
COPY package.json package-lock.json ./
RUN npm ci

# rotate right chart axis name by 180˚ (PI) - there is no better way to do this
RUN sed -i -e 's/-HALF_PI : HALF_PI/-HALF_PI : -HALF_PI/g' ./node_modules/chart.js/dist/chart.js
RUN sed -i -e 's/-helpers_segment.HALF_PI : helpers_segment.HALF_PI/-helpers_segment.HALF_PI : -helpers_segment.HALF_PI/g' ./node_modules/chart.js/dist/chart.cjs

# the rest of the source code needed for building
COPY . .

RUN npm run build


FROM node:18.14.2-bullseye-slim as deployment
RUN apt-get update && apt-get upgrade -y

# keep only the needed files
COPY --from=builder /app/dist /app/dist

WORKDIR /app
ENV NODE_ENV production

FROM node:18.0.0 AS development-stage

RUN apt-get update && apt-get install --no-install-recommends -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

USER node
ARG UID
RUN usermod -u ${UID} node

WORKDIR /app

EXPOSE 9000
ENTRYPOINT ["npm","run", "start"]


FROM node:18.0.0 as build-stage

WORKDIR /app

COPY package*.json .
RUN npm install

COPY ./ ./
RUN npm run build


FROM nginx:1.21.6-alpine AS production-stage

COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]

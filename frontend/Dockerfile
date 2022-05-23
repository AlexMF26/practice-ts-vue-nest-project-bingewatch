FROM node:18.2.0 AS development-stage

RUN apt-get update && apt-get install --no-install-recommends -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb



FROM development-stage AS development-stage-root-user

WORKDIR /app

EXPOSE 9000



FROM development-stage AS development-stage-node-user

USER node
ARG UID
RUN usermod -u ${UID} node

WORKDIR /app

EXPOSE 9000

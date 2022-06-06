FROM node:18.3.0 AS development-stage-root-user

WORKDIR /api

EXPOSE 3000
EXPOSE 9229



FROM node:18.3.0 AS development-stage-node-user

USER node
ARG UID
RUN usermod -u ${UID} node

WORKDIR /api

EXPOSE 3000
EXPOSE 9229

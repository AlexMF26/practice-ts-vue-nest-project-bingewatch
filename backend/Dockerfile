FROM node:18.1.0 AS development-stage-node-user

USER node
ARG UID
RUN usermod -u ${UID} node

WORKDIR /api

EXPOSE 3000
EXPOSE 9229



FROM node:18.1.0 AS development-stage-root-user

WORKDIR /api

EXPOSE 3000
EXPOSE 9229


FROM node:18.1.0 as build-stage

WORKDIR /api

COPY package*.json .
RUN npm install --production

COPY ./ ./
RUN npm run build



FROM node:18.1.0 AS production-stage

RUN npm install -g prisma

COPY --from=build-stage /api/node_modules /api/node_modules
COPY --from=build-stage /api/dist /api/dist

COPY --from=build-stage /api/package.json /api/package.json
COPY --from=build-stage /api/src/Infrastructure/Persistence/Repository/Prisma /api/Prisma
RUN sed -i 's:./src/Infrastructure/Persistence/Repository/Prisma/schema.prisma:./Prisma/schema.prisma:g' /api/package.json

#Temporary
COPY --from=build-stage /api/.env /api/.env

ENV NODE_ENV=production
WORKDIR /api
EXPOSE 3000
ENTRYPOINT ["npm","run", "start:production"]

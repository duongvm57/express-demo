FROM node:18-alpine AS dev
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm i
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD [ "npm", "run", "dev" ]

FROM node:18-alpine AS prod
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm i --only=production
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD [ "npm", "start" ]

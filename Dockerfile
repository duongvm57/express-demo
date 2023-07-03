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
RUN mkdir /usr/src/app/logs
RUN chown -R node:node /usr/src/app/logs
COPY --chown=node:node package*.json ./
RUN npm install pm2 -g
RUN npm i --only=production
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD [ "pm2-runtime", "process.yml" ]

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm i
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD [ "npm", "run", "dev" ]
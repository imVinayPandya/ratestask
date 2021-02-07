FROM node:14-alpine3.10
EXPOSE 8000
WORKDIR /app
RUN apk update && apk add --no-cache yarn && yarn global add pm2 

COPY yarn.lock .
COPY package.json .
RUN yarn install --production

COPY . .
# RUN chown -R node:node /app # <<==== Slow running command, because of node modules
USER node

CMD ["pm2-runtime", "/app/bin/www"]
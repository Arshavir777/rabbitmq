FROM node:16-alpine

WORKDIR /app

COPY package.json /app/

# todo improve
RUN npm install && mv node_modules /node_modules

COPY . /app/

# Install bash and wait-for-it.sh
RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

CMD ["node", "main.js"]
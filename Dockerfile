FROM node:14.4-slim
RUN apt-get update && apt-get install -y git python-minimal make gcc g++
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app

RUN npm install

RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD bash -c "npm run start:prod"
FROM node:14.4-slim
RUN apt-get update && apt-get install -y git python-minimal make gcc g++
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app

RUN npm install
EXPOSE 3000

CMD bash -c "npm start"
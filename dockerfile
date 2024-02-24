FROM node:20-slim
WORKDIR /app
COPY . .
RUN cd /app && apt-get update -y && apt-get install -y openssl bash && npm install
CMD npm run start:dev
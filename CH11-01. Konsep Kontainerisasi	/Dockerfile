# FROM <image>:<tag>
FROM node:23-alpine3.19 

WORKDIR /app

COPY . .

RUN npm install
RUN echo "Dependencies installed"

CMD [ "node", "src/app.js" ]
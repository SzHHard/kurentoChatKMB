FROM node:16-alpine 
RUN mkdir /app
WORKDIR /app 
COPY package.json /app
COPY package-lock.json /app 
RUN npm i 
COPY . /app 
EXPOSE 3001
CMD ["node", "/app/index.js"]

FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD ./build/package.json /usr/src/app/package.json
RUN npm install

# Bundle app source
ADD ./build /usr/src/app

ENV PORT 80
EXPOSE 80

CMD [ "npm", "start" ]

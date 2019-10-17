FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
ADD . /usr/src/app
RUN npm ci --production

# Configure environment variables and expose port
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

CMD [ "npm", "start" ]

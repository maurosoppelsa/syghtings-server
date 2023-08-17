# Common build stage
FROM node:14.15.0-alpine3.12 as common-build-stage

RUN mkdir -p /home/node/app
WORKDIR /home/node/app/
COPY . /home/node/app/

# Create 'sight-photos' directory for storing images
RUN mkdir /home/node/app/sight-photos

RUN npm install

EXPOSE 3000

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["npm", "run", "dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["npm", "run", "start"]

# Specify the base image with Node.js installed
FROM node:lts-alpine as build

WORKDIR /app

RUN mkdir /sight-photos

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the Node.js application
CMD ["npm", "start"]

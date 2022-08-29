FROM node:alpine

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN yarn build-dist
RUN mkdir -p /usr/app/dist/src/client

COPY ./src/client /usr/app/dist/src/client

WORKDIR /usr/app/dist

EXPOSE 5884
CMD node -r module-alias/register src/index.js
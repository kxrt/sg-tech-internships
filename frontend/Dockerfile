# base image
FROM node:18-alpine AS build

# set working directory
WORKDIR /frontend

# copy dependencies
COPY package.json ./

# install dependencies
RUN yarn

# add source code
COPY . ./

# build for production
RUN yarn build

EXPOSE 5173

# run app
CMD ["yarn", "preview"]
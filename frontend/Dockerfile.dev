# base image
FROM node:18-alpine

# set working directory
WORKDIR /frontend

# copy dependencies
COPY package.json ./

# install dependencies
RUN yarn

# add source code
COPY . ./

EXPOSE 5173

# run app
CMD ["yarn", "dev"]
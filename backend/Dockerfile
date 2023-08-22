# base image
FROM golang:alpine

# set working directory
WORKDIR /go/src/backend

# add source code
COPY . /go/src/backend/

# install git
RUN apk update && apk add --no-cache git

# install dependencies
RUN go get ./...

# build app
RUN go build -o app .

EXPOSE 8080

# run app
ENTRYPOINT ["./app"]
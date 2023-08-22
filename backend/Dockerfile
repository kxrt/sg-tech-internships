FROM golang:alpine

WORKDIR /go/src/backend

COPY . /go/src/backend/

RUN apk update && apk add --no-cache git

RUN go get ./...

RUN go build -o app .

EXPOSE 8080

ENTRYPOINT ["./app"]
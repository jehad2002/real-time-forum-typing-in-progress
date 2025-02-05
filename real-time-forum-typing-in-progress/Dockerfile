FROM golang:1.20

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download
RUN apt-get update && apt-get install -y sqlite3

COPY . .

RUN go build -o main .

LABEL maintainer="@jehad @jehan @noor @hind"
LABEL description="This is a Docker image for our Forum application."

EXPOSE 8080
CMD ["./main"]

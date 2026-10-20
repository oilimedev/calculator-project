FROM golang:1.27.3-alpine AS build

WORKDIR /src
COPY go.mod ./
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /calculator ./cmd/api

FROM scratch

COPY --from=build /calculator /calculator
EXPOSE 8080
USER 65532:65532
ENTRYPOINT ["/calculator"]

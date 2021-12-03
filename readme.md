# RabbitMQ-NodeJS

Publisher and consumer simple services with nodejs.

## Requirements
- docker
- docker-compose

## Used dependecies
Docker images
- rabbitmq:3.8-management-alpine
- node:16-alpine

Node Modules
- amqplib@0.8.0

Utils
- wait-for-it.sh // script for wainting rabbitMQ service start event

## Start
```
$ docker-compose up
```

After start you can see docker logs,
```
s1        | SERVICE-1: message published
s2        | SERVICE-2: message published
s2        | SERVICE-2: processing messages
s2        | {"id":545,"from":"service-1"}
s1        | SERVICE-1: processing messages
s1        | {"id":890,"from":"service-2"}
```
Every 3sec publishing messages to `special-queue-2` and `special-queue-1` 
from S1 and S2 services corresponding and consuming messages by order.
Also you can monitor RabbitMQ on http://localhost:15673/
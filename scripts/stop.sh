#!/bin/bash

# app
docker stop backend


# mongodb
docker-compose -f ../mongodb/docker-compose-mongos.yml stop
docker-compose -f ../mongodb/docker-compose-shardsvr.yml stop
docker-compose -f ../mongodb/docker-compose-configsvr.yml stop


# redis
docker stop redis


# hdfs
docker-compose -f ../hdfs/docker-compose.yml stop
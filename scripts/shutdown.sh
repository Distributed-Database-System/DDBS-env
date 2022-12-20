#!/bin/bash

# app
docker stop backend
docker rm backend -v


# mongodb
docker-compose -f ../mongodb/docker-compose-mongos.yml down -v
docker-compose -f ../mongodb/docker-compose-shardsvr.yml down -v
docker-compose -f ../mongodb/docker-compose-configsvr.yml down -v
# remove volumes
docker-compose -f ../mongodb/docker-compose-mongos.yml down -v
docker-compose -f ../mongodb/docker-compose-shardsvr.yml down -v


# redis
docker stop redis
docker rm redis -v


# hdfs
docker-compose -f ../hdfs/docker-compose.yml down -v
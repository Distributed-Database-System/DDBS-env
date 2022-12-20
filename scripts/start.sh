#!/bin/bash

# hdfs
docker-compose -f ../hdfs/docker-compose.yml start
sleep 10


# redis
docker start redis


# mongodb
# config servers
docker-compose -f ../mongodb/docker-compose-configsvr.yml start
# shard servers
docker-compose -f ../mongodb/docker-compose-shardsvr.yml start
# mongos
docker-compose -f ../mongodb/docker-compose-mongos.yml start
sleep 5


# app
docker start backend
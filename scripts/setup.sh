#!/bin/bash

# hdfs
docker-compose -f ../hdfs/docker-compose.yml up -d
sleep 10
docker exec -it namenode hadoop fs -mkdir /articles/
docker exec -it namenode hadoop fs -put /hdfs/articles/ /articles/


# redis
docker pull redis:7.0.0
docker run -itd --name redis -p 6379:6379 redis
docker network connect hdfs_hadoopnet redis --ip 172.21.0.6


# mongodb
# config servers
docker-compose -f ../mongodb/docker-compose-configsvr.yml up -d
mongosh --host localhost --port 40011 ../mongodb/setup-configsvr.js
# shard servers
docker-compose -f ../mongodb/docker-compose-shardsvr.yml up -d
mongosh --host localhost --port 40021 ../mongodb/setup-shardsvr-rs1.js
mongosh --host localhost --port 40031 ../mongodb/setup-shardsvr-rs2.js
# mongos
docker-compose -f ../mongodb/docker-compose-mongos.yml up -d
sleep 5
mongosh --host localhost --port 40002 ../mongodb/setup-mongos.js
docker network connect hdfs_hadoopnet mongos --ip 172.21.0.7

# load data
mongoimport --host localhost --port 40002 -d ddbms -c user --file ../data/user.dat
mongoimport --host localhost --port 40002 -d ddbms -c article --file ../data/article.dat
mongoimport --host localhost --port 40002 -d ddbms -c read --file ../data/read.dat
mongosh --host localhost --port 40002 ../mongodb/generate-beread.js
mongosh --host localhost --port 40002 ../mongodb/generate-rank.js

cd ../../backend
mvn clean package -DskipTests
docker rmi backend:dev
docker build -t backend:dev .
docker run -d --name backend -p 8088:8088 backend:dev
docker network connect hdfs_hadoopnet backend
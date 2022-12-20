@REM hdfs
docker-compose -f ..\hdfs\docker-compose.yml start
timeout /T 10 /NOBREAK


@REM redis
docker start redis


@REM mongodb
@REM config servers
docker-compose -f ..\mongodb\docker-compose-configsvr.yml start
@REM shard servers
docker-compose -f ..\mongodb\docker-compose-shardsvr.yml start
@REM mongos
docker-compose -f ..\mongodb\docker-compose-mongos.yml start
timeout /T 5 /NOBREAK


@REM app
docker start backend
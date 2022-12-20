@REM app
docker stop backend
docker rm backend -v


@REM mongodb
docker-compose -f ..\mongodb\docker-compose-mongos.yml down -v
docker-compose -f ..\mongodb\docker-compose-shardsvr.yml down -v
docker-compose -f ..\mongodb\docker-compose-configsvr.yml down -v
@REM remove volumes
docker-compose -f ..\mongodb\docker-compose-mongos.yml down -v
docker-compose -f ..\mongodb\docker-compose-shardsvr.yml down -v


@REM redis
docker stop redis
docker rm redis -v


@REM hdfs
docker-compose -f ..\hdfs\docker-compose.yml down -v
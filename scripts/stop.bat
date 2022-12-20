@REM app
docker stop backend


@REM mongodb
docker-compose -f ..\mongodb\docker-compose-mongos.yml stop
docker-compose -f ..\mongodb\docker-compose-shardsvr.yml stop
docker-compose -f ..\mongodb\docker-compose-configsvr.yml stop


@REM redis
docker stop redis


@REM hdfs
docker-compose -f ..\hdfs\docker-compose.yml stop
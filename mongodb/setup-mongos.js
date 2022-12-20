// 添加 shard
sh.addShard("shardsvr_rs1/shardsvr1:27018,shardsvr2:27018");
sh.addShard("shardsvr_rs2/shardsvr3:27018,shardsvr4:27018");

// 将 shard 加入到 Zone 中
sh.addShardToZone("shardsvr_rs1", "DBMS1");
sh.addShardToZone("shardsvr_rs2", "DBMS2");
sh.addShardToZone("shardsvr_rs1", "DBMS1-2");
sh.addShardToZone("shardsvr_rs2", "DBMS1-2");

db = db.getSiblingDB('ddbms')

// 对 user 表进行分片
db.createCollection('user');
sh.updateZoneKeyRange("ddbms.user", { region: "Beijing", "uid": MinKey }, { region: "Beijing", "uid": MaxKey }, "DBMS1");
sh.updateZoneKeyRange("ddbms.user", { region: "Hong Kong", "uid": MinKey }, { region: "Hong Kong", "uid": MaxKey }, "DBMS2");
// 对 read 表进行分片
db.createCollection('read');
sh.updateZoneKeyRange("ddbms.read", { region: "Beijing", "_id": MinKey }, { region: "Beijing", "_id": MaxKey }, "DBMS1");
sh.updateZoneKeyRange("ddbms.read", { region: "Hong Kong", "_id": MinKey }, { region: "Hong Kong", "_id": MaxKey }, "DBMS2");
// 对 article 表进行分片
db.createCollection('article');
sh.updateZoneKeyRange("ddbms.article", { category: "science", "aid": MinKey }, { category: "science", "aid": MaxKey }, "DBMS1-2");
sh.updateZoneKeyRange("ddbms.article", { category: "technology", "aid": MinKey }, { category: "technology", "aid": MaxKey }, "DBMS2");
// 对 be - read 表进行分片
db.createCollection('beread');
sh.updateZoneKeyRange("ddbms.beread", { category: "science", "_id": MinKey }, { category: "science", "_id": MaxKey }, "DBMS1-2");
sh.updateZoneKeyRange("ddbms.beread", { category: "technology", "_id": MinKey }, { category: "technology", "_id": MaxKey }, "DBMS2");
// 对 rank 表进行分片
db.createCollection('rank');
sh.updateZoneKeyRange("ddbms.rank", { temporal_granularity: "daily", "_id": MinKey }, { temporal_granularity: "daily", "_id": MaxKey }, "DBMS1");
sh.updateZoneKeyRange("ddbms.rank", { temporal_granularity: "weekly", "_id": MinKey }, { temporal_granularity: "weekly", "_id": MaxKey }, "DBMS2");
sh.updateZoneKeyRange("ddbms.rank", { temporal_granularity: "monthly", "_id": MinKey }, { temporal_granularity: "monthly", "_id": MaxKey }, "DBMS2");

// 启用分片
sh.enableSharding("ddbms");

// 对表进行 shard
sh.shardCollection("ddbms.user", { "region": 1, "uid": 1 });
sh.shardCollection("ddbms.read", { "region": 1, "_id": 1 });
sh.shardCollection("ddbms.article", { "category": 1, "aid": 1 });
sh.shardCollection("ddbms.beread", { "category": 1, "_id": 1 });
sh.shardCollection("ddbms.rank", { "temporal_granularity": 1, "_id": 1 });
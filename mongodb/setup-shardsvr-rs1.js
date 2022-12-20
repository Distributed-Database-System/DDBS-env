rs.initiate(
  {
    _id: "shardsvr_rs1",
    members: [
      { _id: 0, host: "shardsvr1:27018" },
      { _id: 1, host: "shardsvr2:27018" }
    ]
  }
);
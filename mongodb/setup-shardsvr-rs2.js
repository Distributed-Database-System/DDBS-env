rs.initiate(
  {
    _id: "shardsvr_rs2",
    members: [
      { _id: 0, host: "shardsvr3:27018" },
      { _id: 1, host: "shardsvr4:27018" }
    ]
  }
);
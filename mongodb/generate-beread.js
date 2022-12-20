db = db.getSiblingDB('ddbms');
db.read.aggregate([
  {
    $group: {
      _id: "$aid",
      timestamp: { $max: "$timestamp" },
      aid: { $first: "$aid" },
      readNum: { $sum: 1 },
      readUidList: { $addToSet: "$uid" },
      commentNum: { $sum: { $toInt: "$commentOrNot" } },
      commentUidList: { $addToSet: { $cond: [{ $eq: ["$commentOrNot", "1"] }, "$uid", "$$REMOVE"] } },
      agreeNum: { $sum: { $toInt: "$agreeOrNot" } },
      agreeUidList: { $addToSet: { $cond: [{ $eq: ["$agreeOrNot", "1"] }, "$uid", "$$REMOVE"] } },
      shareNum: { $sum: { $toInt: "$shareOrNot" } },
      shareUidList: { $addToSet: { $cond: [{ $eq: ["$shareOrNot", "1"] }, "$uid", "$$REMOVE"] } },
      category: { $first: "$category" },
    }
  },
  { $merge: "beread" }
],
  { allowDiskUse: true }
);
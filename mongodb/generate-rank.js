db = db.getSiblingDB('ddbms');

// monthly
db.read.aggregate([
  { $project: { timestamp: { $toDate: { $toLong: "$timestamp" } }, aid: 1, agreeOrNot: 1, commentOrNot: 1, shareOrNot: 1 } },
  {
    $set: {
      aid: "$aid",
      formatedTime: { $dateToString: { format: "year:%Y-month:%m", date: "$timestamp" } },
      score: {
        $sum: [
          1,
          { $multiply: [{ $toInt: "$agreeOrNot" }, 3] },
          { $multiply: [{ $toInt: "$commentOrNot" }, 2] },
          { $multiply: [{ $toInt: "$shareOrNot" }, 3] }]
      }
    }
  },
  {
    $group: {
      _id: { aid: "$aid", formatedTime: "$formatedTime" },
      totalScore: { $sum: "$score" }
    }
  },
  { $sort: { totalScore: -1 } },
  {
    $group: {
      _id: { formatedTime: "$_id.formatedTime" },
      articleAidList: { $push: "$_id.aid" },
      articleTotalScoreList: { $push: "$totalScore" }
    }
  },
  { $project: { _id: "$_id.formatedTime", temporal_granularity: "monthly", timestamp: "$_id.formatedTime", articleAidList: 1, articleTotalScoreList: 1 } },
  { $merge: "rank" }
],
  { allowDiskUse: true }
);

// weekly
db.read.aggregate([
  { $project: { timestamp: { $toDate: { $toLong: "$timestamp" } }, aid: 1, agreeOrNot: 1, commentOrNot: 1, shareOrNot: 1 } },
  {
    $set: {
      aid: "$aid",
      formatedTime: { $dateToString: { format: "year:%Y-week:%U", date: "$timestamp" } },
      score: {
        $sum: [
          1,
          { $multiply: [{ $toInt: "$agreeOrNot" }, 3] },
          { $multiply: [{ $toInt: "$commentOrNot" }, 2] },
          { $multiply: [{ $toInt: "$shareOrNot" }, 3] }]
      }
    }
  },
  {
    $group: {
      _id: { aid: "$aid", formatedTime: "$formatedTime" },
      totalScore: { $sum: "$score" }
    }
  },
  { $sort: { totalScore: -1 } },
  {
    $group: {
      _id: { formatedTime: "$_id.formatedTime" },
      articleAidList: { $push: "$_id.aid" },
      articleTotalScoreList: { $push: "$totalScore" }
    }
  },
  { $project: { _id: "$_id.formatedTime", temporal_granularity: "weekly", timestamp: "$_id.formatedTime", articleAidList: 1, articleTotalScoreList: 1 } },
  { $merge: "rank" }
],
  { allowDiskUse: true }
);

// daily
db.read.aggregate([
  { $project: { timestamp: { $toDate: { $toLong: "$timestamp" } }, aid: 1, agreeOrNot: 1, commentOrNot: 1, shareOrNot: 1 } },
  {
    $set: {
      aid: "$aid",
      formatedTime: { $dateToString: { format: "year:%Y-day:%j", date: "$timestamp" } },
      weeks: { $subtract: [{ $toLong: "$timestamp" }, { $mod: [{ $toLong: "$timestamp" }, 86400000] }] },
      score: {
        $sum: [
          1,
          { $multiply: [{ $toInt: "$agreeOrNot" }, 3] },
          { $multiply: [{ $toInt: "$commentOrNot" }, 2] },
          { $multiply: [{ $toInt: "$shareOrNot" }, 3] }]
      }
    }
  },
  {
    $group: {
      _id: { aid: "$aid", formatedTime: "$formatedTime" },
      totalScore: { $sum: "$score" }
    }
  },
  { $sort: { totalScore: -1 } },
  {
    $group: {
      _id: { formatedTime: "$_id.formatedTime" },
      articleAidList: { $push: "$_id.aid" },
      articleTotalScoreList: { $push: "$totalScore" }
    }
  },
  { $project: { _id: "$_id.formatedTime", temporal_granularity: "daily", timestamp: "$_id.formatedTime", articleAidList: 1, articleTotalScoreList: 1 } },
  { $merge: "rank" }
],
  { allowDiskUse: true }
);
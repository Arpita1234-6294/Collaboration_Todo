const ActionLog = require("../models/ActionLog");

exports.getLatestlogs = async (req, res) => {
  try {
    const logs = await ActionLog.find()
      .populate("user", "username email")
      .populate("task", "title")
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

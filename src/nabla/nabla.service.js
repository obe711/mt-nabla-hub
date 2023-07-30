const mongoose = require('mongoose');
const { User } = require('../models');

const getDbStats = async () => {
  const db = mongoose.connection;
  return db.db.stats();
};

const getUserCount = () => {
  return User.countDocuments({});
};

module.exports = {
  getDbStats,
  getUserCount,
};

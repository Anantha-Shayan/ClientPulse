const mongoose = require('mongoose');
const env = require('./env');

const connectMongo = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGO_URI);
};

module.exports = connectMongo;

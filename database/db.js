const mongoose = require('mongoose')


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('DB connected successfully!');

  } catch (e) {
    console.error('DB connection failed.');
  }
}

module.exports = connectDB;
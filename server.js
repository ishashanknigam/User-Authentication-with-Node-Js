require('dotenv').config();
const express = require('express');
const connectDB = require('./database/db');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
})
// ✅ Add this line at the top
console.log("🚀 Server file started...");

// Then the rest of your code
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const movieRoutes = require('./routes/movies');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/movies', movieRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  });
})
.catch(err => console.error('❌ MongoDB connection error:', err));

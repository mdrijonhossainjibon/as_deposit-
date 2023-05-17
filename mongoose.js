const mongoose = require("mongoose");

// Connection URI
const uri =
  "mongodb+srv://doadmin:T90z356s1FL7wK4g@db-mongodb-nyc1-03894-f1901bee.mongo.ondigitalocean.com/tradingdb?tls=true&authSource=admin&replicaSet=db-mongodb-nyc1-03894";

// Mongoose connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


// Connect to MongoDB server mopre
mongoose
  .connect(uri, options)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start your application logic here
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

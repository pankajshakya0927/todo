const mongoose = require("mongoose");
// const connectionUrl = "mongodb+srv://admin:fnurq8EzMN8JH7sV@cluster0.tpeau.mongodb.net/budget-manager?retryWrites=true&w=majority";
const connectionUrl = "mongodb://127.0.0.1:27017/todo"; // local connection url

mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGODB_URI || connectionUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, db) => {
    if (err) {
      console.error(err);
    }

    if (db) {
      console.log("Connected to mongodb...");
    }
  }
);

module.exports = mongoose;

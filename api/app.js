const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const morgan = require("morgan");
const config = require("../config");

const contactsRouter = require("./contacts/contacts.router");
const userRouter = require("./user/user.router");
const { json } = require("express");

const app = express();

app.use(express.static("api/public"));

app.use(json());
app.use(cors());
app.use(morgan());

app.use("/api/contacts", contactsRouter);
app.use("/", userRouter);

mongoose.set("useFindAndModify", false);

const dbConnect = async () => {
  try {
    await mongoose.connect(config.databaseName, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const startServer = async () => {
  await dbConnect();

  app.listen(config.port, () =>
    console.log(`App listening at http://localhost:${config.port}`)
  );
};

startServer();

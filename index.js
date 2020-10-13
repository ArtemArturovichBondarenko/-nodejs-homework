const morgan = require("morgan");
const cors = require("cors");
const connection = require("./database/Connection");

const express = require("express");
const contactsRouter = require("./routers/contactsRouter");
const tokenCleaner = require("./cron/token-cleaner");

const app = express();
const PORT = 5500;

async function main() {
  await connection.connect();
  tokenCleaner();

  app.use(morgan("tiny"));
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(cors());
  //============
  app.use(express.static("public"));
  //===========

  app.use("/contacts", contactsRouter);

  app.listen(PORT, (err) => {
    if (err) {
      return console.error(err);
    }
    console.info("server started PORT", PORT);
  });

  process.on("SIGINT", () => {
    connection.close();
  });
}

main().catch(console.error);

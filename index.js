const morgan = require("morgan");
const cors = require("cors");
const connection = require("./database/Connection");

const express = require("express");
const contactsRouter = require("./contactsRouter");

const app = express();
const PORT = 3000;

async function main() {
  await connection.connect();

  app.use(morgan("tiny"));
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(cors());

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

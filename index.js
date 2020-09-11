const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const contactsRouter = require("./contactsRouter");

const app = express();
const PORT = 3000;

app.use(morgan("tiny"));
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.use("/contacts", contactsRouter);

app.listen(PORT, () => {});

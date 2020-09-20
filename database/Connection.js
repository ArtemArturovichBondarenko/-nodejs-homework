const mongoose = require("mongoose");
const config = require("../config");

class Connection {
  constructor() {
    this.connection = null;
    this.database = null;
  }

  getCollection(name) {
    return this.database.collection(name)
  }

  async connect() {
    const connectionStatePromise = new Promise((resolve, reject) => {
      mongoose.connection.on("error", (e) => {
        reject(e);
      });
      mongoose.connection.on("open", () => {
        resolve();
      });
    });

    await mongoose.connect(
      `${config.databaseConnectionUrl}/${config.databaseName}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    return connectionStatePromise;
  }

  async close() {
    mongoose.connection.close();
  }
}

module.exports = new Connection();

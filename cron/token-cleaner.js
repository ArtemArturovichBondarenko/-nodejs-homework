const lodash = require("lodash");
const ContactModel = require("../database/models/ContactModel");

const main = async () => {
  try {
    const contacts = await ContactModel.find({
      "tokens.expires": { $lte: new Date().getTime() },
    });

    for (const contact of contacts) {
      contact.tokens = contact.tokens.filter((token) => {
        return new Date(token.expires).getTime() > new Date().getTime();
      });
    }

    const contactsChunks = lodash.chunk(contacts, 100);

    for (const chunk of contactsChunks) {
      await Promise.all(chunk.map((contact) => contact.save()));
    }

    setTimeout(main, 60e3);
  } catch (e) {
    console.error("CRON TOKEN CLEANER ERROR", e);
    setTimeout(main, 60e3);
  }
};

module.exports = main;

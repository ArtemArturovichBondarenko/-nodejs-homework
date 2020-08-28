const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

// TODO: задокументировать каждую функцию
async function listContacts() {
  const data = await fs.promises.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const data = await fs.promises.readFile(contactsPath, "utf-8");
  const parseData = JSON.parse(data);
  const findContactById = parseData.find((item) => item.id === contactId);
  return findContactById;
}

async function addContact(name, email, phone) {
  const data = await listContacts();
  console.log("data", data);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    phone,
  };
  const newContacts = [...data, newUser];
  await fs.promises.writeFile(contactsPath, JSON.stringify(newContacts));
  return newContacts;
}

async function removeContact(contactId) {
  const data = await fs.promises.readFile(contactsPath, "utf-8");
  const parseData = JSON.parse(data);
  const RemoveContactById = parseData.filter((item) => item.id !== contactId);
  return RemoveContactById;
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
};

// module.exports.listContacts = listContacts;
// module.exports.getContactById = getContactById;
// module.exports.addContact = addContact;

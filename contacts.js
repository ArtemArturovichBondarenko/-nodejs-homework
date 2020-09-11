const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  const data = await fs.promises.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const data = await listContacts();
  const findContactById = data.find((item) => String(item.id) === contactId);
  return findContactById;
}

async function addContact(name, email, phone) {
  const data = await listContacts();
  const newUser = {
    id: uuidv4(),
    name,
    email,
    phone,
  };
  const newContacts = [...data, newUser];
  await fs.promises.writeFile(contactsPath, JSON.stringify(newContacts));
  return { id: uuidv4(), name, email, phone };
}

async function removeContact(contactId) {
  const data = await listContacts();
  const RemoveContactById = data.filter(
    (item) => String(item.id) !== contactId
  );
  await fs.promises.writeFile(contactsPath, JSON.stringify(RemoveContactById));

  return RemoveContactById;
}

async function updateContact(contactId, objectContact) {
  const data = await listContacts();
  const findContactById = data.find((item) => String(item.id) === contactId);
  Object.keys(objectContact).forEach((key) => {
    findContactById[key] = objectContact[key];
  });
  const newContacts = [...data, findContactById];

  await fs.promises.writeFile(contactsPath, JSON.stringify(newContacts));
  return findContactById;
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};

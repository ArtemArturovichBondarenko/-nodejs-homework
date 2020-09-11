const express = require("express");
const router = express.Router();
const contacts = require("./contacts");
const joi = require("joi");

router.get("/", async (req, res, next) => {
  arreyContacts = await contacts.listContacts();
  if (arreyContacts.length === 0) {
    res.json("Sorry no contacts");
  }

  res.json(arreyContacts);
});

//===================================

router.get("/:contactId", async (req, res, next) => {
  id = req.params.contactId;
  arreyContacts = await contacts.getContactById(id);
  if (arreyContacts === undefined) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(arreyContacts);
});

//===========================================

router.post("/", async (req, res, next) => {
  const contactRules = joi
    .object({
      name: joi.string().required(),
      email: joi.string().required(),
      phone: joi.string().required(),
    })
    .validate(req.body);

  if (contactRules.error) {
    return res.status(400).json({ message: "missing required name field" });
  }

  const { name, email, phone } = req.body;

  arreyContacts = await contacts.addContact(name, email, phone);

  res.status(201).send(arreyContacts);
});

//=====================================

router.delete("/:contactId", async (req, res, next) => {
  id = req.params.contactId;

  arreyContacts = await contacts.listContacts();

  arrayOfRemainingContacts = await contacts.removeContact(id);

  if (arreyContacts.length === arrayOfRemainingContacts.length) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "contact deleted" });
  console.log(id);
});

//==============================

router.patch("/:contactId", async (req, res, next) => {
  validatingRequestBody = Object.keys(req.body).length;
  if (validatingRequestBody === 0) {
    return res.status(400).json({ message: "missing fields" });
  }

  const contactRules = joi
    .object({
      name: joi.string(),
      email: joi.string(),
      phone: joi.string(),
    })
    .validate(req.body);

  if (contactRules.error) {
    return res.status(404).json({ message: "Joi Not found" });
  }

  id = req.params.contactId;
  // const { name, email, phone } = req.body;
  changeablecontact = await contacts.updateContact(id, req.body);
  if (changeablecontact === undefined) {
    return res.status(404).json({ message: "id Not found" });
  }
  res.status(200).send(changeablecontact);

  console.log(changeablecontact);
});

module.exports = router;

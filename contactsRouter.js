const express = require("express");
const router = express.Router();

const ContactModel = require("./database/models/ContactModel");

router.get("/", async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const contacts = await ContactModel.find().sort({ name: 1 }).limit(limit);

    res.send({ contacts });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

//===================================
router.get("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await ContactModel.findById(contactId);
    if (!contact) {
      return res.status(404).send({ message: "contact not found" });
    }

    res.send(contact);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }


//===========================================


router.post("/", async (req, res) => {
  try {
    const contact = await ContactModel.create(req.body);

    res.send({ contact });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }

});

//=====================================


router.delete("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await ContactModel.findById(contactId);
    if (!contact) {
      return res.status(404).send({ message: "contact not found" });
    }

    contact.remove();

    res.send(contact);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }

});

//==============================


router.patch("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await ContactModel.findById(contactId);

    if (!contact) {
      return res.status(404).send({ message: "contact not found" });
    }

    Object.keys(req.body).forEach((key) => {
      contact[key] = req.body[key];
    });

    await contact.save();
    res.send({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }

});

module.exports = router;

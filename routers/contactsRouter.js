const express = require("express");
const router = express.Router();
const {
  validate,
  generateFilename,
  errorHandler,
  moveFile,
} = require("../helpers");
const joi = require("joi");
const fs = require("fs").promises;
const path = require("path");
const config = require("../config");
const bcrypt = require("bcrypt");
const authCheck = require("../middlewares/auth-check");
const { multer, imageMin } = require("../services");

const FileModel = require("../database/models/FileModel");
const ContactModel = require("../database/models/ContactModel");

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
});

//===========================================

router.post(
  "/register/with-avatar",
  multer.single("avatar"),
  async (req, res) => {
    try {
      let filename = generateFilename(req.file.mimetype);
      const minFilename = `min-${filename}`;
      const filepath = config.path.files;

      const minImage = await imageMin(req.file.path);

      await Promise.all([
        moveFile(req.file.path, path.join(filepath, filename)),
        moveFile(minImage.destinationPath, path.join(filepath, minFilename)),
      ]);

      const fileRecord = await FileModel.create({
        path: filepath,
        name: filename,
      });
      await FileModel.create({
        path: filepath,
        name: minFilename,
        origin: fileRecord._id,
      });
    } catch (e) {
      errorHandler(req, res, e);
    }
  }
);

//===========================================

router.post("/auth/login", async (req, res) => {
  try {
    validate(
      joi.object({
        email: joi.string().required(),
        password: joi.string().required(),
      }),
      req.body
    );

    const { email, password } = req.body;

    const contact = await ContactModel.findOne({ email });

    if (!contact) throw new Error("Email or password is wrong");

    const isValid = bcrypt.compare(password, contact.password);

    if (!isValid) throw new Error("Email or password is wrong");

    const token = await contact.generateAndSaveToken();
    res.send({
      id: contact._id,
      name: contact.name,
      email: contact.email,
      subscription: contact.subscription,
      activeToken: token,
    });
  } catch (e) {
    console.error(e);
    res.status(401).send(e);
  }
});

//===========================================

router.post("/auth/register", async (req, res) => {
  try {
    validate(
      joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        phone: joi.number().required(),
        password: joi.string().required(),
      }),
      req.body
    );

    const { name, email, phone, password } = req.body;

    const [contact] = await ContactModel.find({
      $or: [{ email }, { phone }],
    });

    if (contact) {
      res.status(400).send("Email or phone in use");
      throw new Error("Email or phone in use");
    }

    const createContact = await ContactModel.create({
      name,
      email,
      phone,
      password,
    });

    res.status(201).send({ createContact });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

//==========================================

router.get("/:contactId/users/current", authCheck, async (req, res) => {
  try {
    const { contact } = req;
    const { contactId } = req.params;

    if (String(contact._id) !== contactId) {
      throw new Error("Not authorized");
    }

    res.send({
      contact: await ContactModel.findById(contactId),
    });
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

//===========================================

router.post("/:contactId/auth/logout", authCheck, async (req, res) => {
  try {
    let { contact } = req;
    let { contactId } = req.params;

    if (String(contact._id) !== contactId) {
      throw new Error("Not authorized");
    } else {
      contact = await ContactModel.findByIdAndUpdate(contactId, { tokens: [] });
    }

    res.status(204).send({ message: "No Content" });
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

//========================================

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

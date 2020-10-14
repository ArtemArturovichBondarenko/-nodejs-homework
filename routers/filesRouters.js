const express = require("express");
const fs = require("fs");
const path = require("path");
const FileModel = require("../database/models/FileModel");
const { errorHandler, ApiError, generateFilename } = require("../helpers");

const router = express.Router();

router.get("/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    const file = await FileModel.findOne({ name: filename });

    if (!file) {
      throw new ApiError(404, "File not found");
    }

    res.sendFile(path.join(file.path, file.name));
  } catch (e) {
    errorHandler(req, res, e);
  }
});

router.post("/", (req, res) => {
  let writeSteamError = null;

  const fileName = generateFilename(req.headers["content-type"]);
  const filePath = path.join(__dirname, "../public/images", fileName);

  const writeStream = fs.createWriteStream(filePath);

  req.pipe(writeStream);

  writeStream.on("error", (err) => {
    console.error("write stream error", err);
    writeSteamError = err;
  });

  req.on("end", async () => {
    try {
      if (writeSteamError) {
        throw writeSteamError;
      }

      writeStream.close();

      await FileModel.create({
        path: filePath,
        name: fileName
      });

      res.send({ file: { path: filePath } });
    } catch (e) {
      errorHandler(req, res, e);
    }
  });
});

module.exports = router;
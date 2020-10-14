const multer = require("multer");
const path = require("path");
const FileModel = require("../database/models/FileModel");

const filePath = path.join(__dirname, "../tmp");

module.exports = multer({ dest: filePath });
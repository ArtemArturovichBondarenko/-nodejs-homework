const multer = require("multer");
const config = require("../config");
const FileModel = require("../database/models/FileModel");

const filePath = config.path.tmp;

module.exports = multer({ dest: filePath });

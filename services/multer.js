const multer = require("multer");
const path = require("path");
const FileModel = require("../database/models/FileModel");

const filePath = path.join(__dirname, "../tmp");

const storage = multer.diskStorage({
    // destination: async (req, file, clb) => {
    //   try {
    //     await FileModel.create({
    //       path: path.join(filepath, file.filename),
    //       name: file.filename,
    //       type: "tmp"
    //     });
    //     clb(null, filepath);
    //   } catch (e) {
    //     console.error("writefile error", e);
    //     clb();
    //   }
    // }
  });
  

module.exports = multer({ dest: filePath });
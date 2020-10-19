const fs = require("fs").promises;

const moveFile = async (source, desc) => {
  try {
    await fs.rename(source, desc);
  } catch (e) {
    console.warn("warn", e);

    await fs.copyFile(source, desc);
    await fs.unlink(source);
  }
};

module.exports = moveFile;

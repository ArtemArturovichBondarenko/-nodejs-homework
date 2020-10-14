const imageMin = require("imagemin");
const imageMinJpeg = require("imagemin-jpegtran");
const imageMinPng = require("imagemin-pngquant");
const config = require("../config");

module.exports = async (source) => {
  const [image] = await imageMin([source], {
    destination: config.path.tmp,
    plugins: [
      imageMinJpeg(),
      imageMinPng({
        quality: [0.6, 0.8],
      }),
    ],
  });
  return image;
};

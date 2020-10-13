const express = require("express");
const fs = require("fs");
const path = require("path");
const FileModel = require("../database/models/FileModel");
const { errorHandler, ApiError, generateFilename } = require("../helpers");

const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const filePath = path.join(__dirname, "");
//   }
// });

// const avatarPath = path.join(__dirname, "../public/images");

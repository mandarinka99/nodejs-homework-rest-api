const Jimp = require("jimp");
const FsPromises = require("fs").promises;

const path = require("path");

const STATIC_DIR = path.join(__dirname, "../public/avatars");

async function compressImage(req, res, next) {
  const draftFilePath = req.file.path;

  const file = await Jimp.read(draftFilePath);
  const compressedPath = path.join(STATIC_DIR, req.file.filename);

  await file.resize(250, 250).writeAsync(compressedPath);

  await FsPromises.unlink(draftFilePath);

  req.file.destination = STATIC_DIR;
  req.file.path = compressedPath;

  next();
}

exports.compressImage = compressImage;

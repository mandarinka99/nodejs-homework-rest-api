const multer = require("multer");
const path = require("path");

const gravatar = require("gravatar");

const DRAFT_DIR = path.join(__dirname, "../tmp");
console.log(`DRAFT_DIR`, DRAFT_DIR);

const storage = multer.diskStorage({
  destination: DRAFT_DIR,
  filename: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new BadRequest("Only images allowed"));
    }

    const ext = path.extname(file.originalname);
    const url = gravatar.url(req.body.email || req.user.email);

    const splitted = url.split("/");
    const fileName = splitted[splitted.length - 1];

    cb(null, `${fileName}${ext}`);
  },
});

const upload = multer({ storage });

exports.upload = upload;

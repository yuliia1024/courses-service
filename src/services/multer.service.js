const multer = require('multer');
const { UPLOADING_FILE, FILE_SIZE_LIMIT } = require('../constants');

const multerMemoryStorage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldNameSize: 255,
    fileSize: FILE_SIZE_LIMIT,
  },
});

const parseSingleFile = multerMemoryStorage.single(UPLOADING_FILE.file);

module.exports = {
  parseSingleFile,
};

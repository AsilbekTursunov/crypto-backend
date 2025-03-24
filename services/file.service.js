const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const BaseError = require("../errors/base.error");
class FileService {
  save(file) {
    try {
      const fileName = uuid() + ".jpg";
      const currentpath = __dirname;
      const staticDir = path.join(currentpath, "..", "static");
      const filePath = path.join(staticDir, fileName);

      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
      }

      file.mv(filePath);

      return fileName;
    } catch (error) {
      return new BaseError.BadRequest("File saving error", error);
    }
  }
}

module.exports = new FileService();

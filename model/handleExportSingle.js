const { generateSingleFile } = require("./generateSingleFile");


exports.handleExportSingle = async (req) => generateSingleFile(req.file, req.body)

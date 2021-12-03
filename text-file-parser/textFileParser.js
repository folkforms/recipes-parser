const fileio = require("@folkforms/file-io");
const m2x = require("markdown-to-x");

const textFileParser = inputFilename => {
  const inputData = fileio.readLines(inputFilename);
  const structure = fileio.readLines("text-file-parser/structure.md");
  const templateData = fileio.readLines("text-file-parser/template.json");

  const outputData = m2x(inputData, structure, null, templateData, inputFilename);
  return outputData;
}

module.exports = textFileParser;

const fileio = require("@folkforms/file-io");
const m2x = require("markdown-to-x");

const textFileParser = inputFilename => {
  let inputData = fileio.readLines(inputFilename);
  inputData = validateInput(inputData);

  const structure = fileio.readLines("text-file-parser/structure.md");
  const templateData = fileio.readLines("text-file-parser/template.json");

  const outputData = m2x(inputData, structure, null, templateData, inputFilename, { cleanLists: false });
  return outputData;
}

const validateInput = inputData => {
  inputData = inputData.map(line => line.replace(/"/g, "\\\""));
  if(inputData.indexOf("## Leftovers") === -1) {
    inputData.push("## Leftovers");
  }
  if(inputData.indexOf("## Notes") === -1) {
    inputData.push("## Notes");
  }
  if(missingMetaData("TAGS: ", inputData)) {
    inputData.splice(2, 0, "TAGS: Untagged");
  }
  if(missingMetaData("SHOPPING LIST: ", inputData)) {
    inputData.splice(2, 0, "SHOPPING LIST: ???");
  }
  return inputData;
}

const missingMetaData = (metaData, inputData) => {
  return inputData.filter(line => line.startsWith(metaData)).length === 0;
}

module.exports = textFileParser;

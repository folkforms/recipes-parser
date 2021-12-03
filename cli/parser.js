const fileio = require("@folkforms/file-io");
const textFileParser = require("../text-file-parser/textFileParser");
const metaDataParser = require("../meta-data-parser/metaDataParser");

const parser = (inputFolder, outputFolder) => {
  const textFiles = fileio.glob(inputFolder + "/**");
  console.log(`#### textFiles = ${JSON.stringify(textFiles)}`);

  textFiles.forEach(textFile => {
    const p1 = textFileParser(textFile);
    const p2 = metaDataParser(p1);

    JSON.parse(p2.join("")); // Validate json

    console.log(`#### inputFilename  = ${textFile}`);
    const outputFilename = textFile.replace(inputFolder, outputFolder).replace(".txt", ".json");
    console.log(`#### outputFilename = ${outputFilename}`);

    fileio.writeLines(outputFilename, p2);
  });
}

module.exports = parser;

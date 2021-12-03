const fileio = require("@folkforms/file-io");
const textFileParser = require("../text-file-parser/textFileParser");
const metaDataParser = require("../meta-data-parser/metaDataParser");

const allRecipes = [];
const parser = (inputFolder, outputFile) => {
  const textFiles = fileio.glob(inputFolder + "/**");

  textFiles.forEach(textFile => {
    const p1 = textFileParser(textFile);
    const fromJson = JSON.parse(p1.join(""));
    const p2 = metaDataParser(fromJson);
    allRecipes.push(p2);
  });

  fileio.writeLines(outputFile, JSON.stringify(allRecipes));
}

module.exports = parser;

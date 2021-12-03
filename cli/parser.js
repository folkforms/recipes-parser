const fileio = require("@folkforms/file-io");
const textFileParser = require("../text-file-parser/textFileParser");
const metaDataParser = require("../meta-data-parser/metaDataParser");

const allRecipes = [];
const parser = (inputFolder, outputFile) => {
  const textFiles = fileio.glob(inputFolder + "/**");

  textFiles.forEach(textFile => {
    const p1 = textFileParser(textFile);
    const p2 = metaDataParser(p1);
    const fromJson = JSON.parse(p2.join(""));
    allRecipes.push(fromJson);
  });

  fileio.writeLines(outputFile, JSON.stringify(allRecipes));
}

module.exports = parser;

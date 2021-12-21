const fileio = require("@folkforms/file-io");
const textFileParser = require("../text-file-parser/textFileParser");
const metaDataParser = require("../meta-data-parser/metaDataParser");

const allRecipes = [];
const parser = (inputGlob, outputFile, options) => {
  const textFiles = fileio.glob(inputGlob);

  textFiles.forEach(textFile => {
    try {
      const p1 = textFileParser(textFile);
      const p2 = p1.join("");
      const fromJson = JSON.parse(p2);
      const final = metaDataParser(fromJson);
      allRecipes.push(final);
      if(options.showSuccess) {
        console.info(`Successfully parsed ${textFile}`);
      }
    } catch(error) {
      console.error(`Error processing ${textFile}`);
      console.error(error);
    }
  });

  if(!options.dryRun) {
    fileio.writeLines(outputFile, JSON.stringify(allRecipes));
  } else {
    console.info(`[DRY RUN] textFiles = ${JSON.stringify(textFiles)}`);
    console.info(`[DRY RUN] allRecipes = ${JSON.stringify(allRecipes)}`);
    console.info(`[DRY RUN] outputFile = ${outputFile}`);
  }
}

module.exports = parser;

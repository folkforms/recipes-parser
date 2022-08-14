const fileio = require("@folkforms/file-io");
const debug = require("./debug");
const textFileParser = require("../text-file-parser/textFileParser");
const metaDataParser = require("../meta-data-parser/metaDataParser");
const ingredientsParser = require("../ingredients-parser/ingredientsParser");

const allRecipes = [];
const parser = (globs, outputFile, options) => {
  debug(options.debug, `globs = ${globs}, outputFile = ${outputFile}, options = ${JSON.stringify(options)}`);
  let textFiles = [];
  globs.forEach(glob => {
    textFiles.push(fileio.glob(glob));
  });
  textFiles = textFiles.flat();

  textFiles.forEach(textFile => {
    try {
      const p1 = textFileParser(textFile);
      const p2 = p1.join("");
      const fromJson = JSON.parse(p2);

      if(!fromJson.name) {
        console.warn(`WARNING: Skipped recipe '${textFile}' with no title`);
        return;
      }

      const part2 = metaDataParser(fromJson);
      const part3 = ingredientsParser(part2);
      allRecipes.push(part3);
      if(options.showSuccess) {
        console.info(`Successfully parsed ${textFile}`);
      }
    } catch(error) {
      console.error(`Error processing ${textFile}`);
      console.error(error);
    }
  });

  const foodUtils = require("../ingredients-parser/foodUtils");
  foodUtils.validate();

  printStats(textFiles.length);

  if(!options.dryRun) {
    fileio.writeLines(outputFile, JSON.stringify(allRecipes));
  } else {
    console.info(`[DRY RUN] textFiles = ${JSON.stringify(textFiles)}`);
    console.info(`[DRY RUN] allRecipes = ${JSON.stringify(allRecipes)}`);
    console.info(`[DRY RUN] outputFile = ${outputFile}`);
  }
}

const printStats = numProcessed => {
  const totalFiles = [fileio.glob("f:/documents/food/**/*.txt"), fileio.glob("f:/documents/food/**/*.md")].flat().length;
  console.info(`Processed ${numProcessed} of ${totalFiles} files (${(numProcessed/totalFiles*100).toFixed(0)}%)`);
}

module.exports = parser;

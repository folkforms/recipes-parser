// FIXME Add CLI options

const parser = require("./parser");

const inputFolder = "cli/test-data/input";
const outputFile = "cli/test-data/output/recipes.json";

parser(inputFolder, outputFile);

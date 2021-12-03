// FIXME Add CLI options

const parser = require("./parser");

const inputFolder = "cli/test-data/input";
const outputFolder = "cli/test-data/output";

parser(inputFolder, outputFolder);

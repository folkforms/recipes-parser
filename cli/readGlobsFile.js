const fileio = require("@folkforms/file-io");

const readGlobsFile = file => {
  let lines = fileio.readLines(file);
  lines = lines.filter(line => !line.startsWith("#") && line.trim().length !== 0);
  lines = lines.map(line => `f:/documents/food/${line}`);
  return lines;
}

module.exports = readGlobsFile;

#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const parser = require("./parser");
const readGlobsFile = require("./readGlobsFile");

// Parse command-line args
program
  .option('-i, --input <input glob>', 'input glob')
  .option('-f, --file <input file>', 'input file')
  .requiredOption('-o, --output <output file>', 'output file')
  .option('-s, --show-success', 'verbose logging of successful files')
  .option('-n, --dry-run', 'show the commands that would be run, without actually running anything')
  .parse(process.argv);

if(!program.opts().input && !program.opts().file) {
  console.error("ERROR: One of --input <input glob> or --file <input file> must be specified.");
  process.exit(1);
}

let globs = program.opts().input ? [program.opts().input] : readGlobsFile(program.opts().file);
globs = globs.map(glob => glob.replace(/\\/g, '/'));
const outputFile = program.opts().output.replace(/\\/g, '/');
const options = {
  showSuccess: program.opts().showSuccess,
  dryRun: program.opts().dryRun,
}

const r = parser(globs, outputFile, options);
process.exit(r);

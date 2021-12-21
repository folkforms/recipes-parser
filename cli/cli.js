#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const parser = require("./parser");

// Parse command-line args
program
  .requiredOption('-i, --input <input glob>', 'input glob')
  .requiredOption('-o, --output <output file>', 'output file')
  .option('-s, --show-success', 'verbose logging of successful files')
  .option('-n, --dry-run', 'show the commands that would be run, without actually running anything')
  .parse(process.argv);

const inputGlob = program.opts().input.replace(/\\/g, '/');
const outputFile = program.opts().output.replace(/\\/g, '/');
const options = {
  showSuccess: program.opts().showSuccess,
  dryRun: program.opts().dryRun,
}

parser(inputGlob, outputFile, options);

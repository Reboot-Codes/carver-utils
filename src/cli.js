#!/usr/bin/env node

import commander from 'commander';
import getPackage from './getPackage.cjs';

const program = commander.program;
const packageData = getPackage
const options = program.opts();

import getPage from "./commands/get-page.js"

program
  .description('a suite of utilities for reverse engineering software')
  .version(packageData.version)

program
  .option('-d, --debug', 'enables error logging')

program
  .command("get-page")
  .description("takes a screenshot and downloads the source code for the specified page")
  .argument("<website>", "required, in double quotes (just in case), webpage to download")
  .argument("[outpath]", "optional, should exist beforehand, directory to output to")
  .addHelpText("after", `\nWarning: This command will overwrite existing files named "screenshot.png" and "source.html" in the specified directory`)
  .action((website, outpath) => getPage(website, outpath, options))

program.parseAsync()

#!/usr/bin/env node

import { Command } from "commander";
import saveHTML from "../src/download-html-page.js";

const program = new Command();

program
  .name("page-loader")
  .version("0.1.0")
  .description("Page loader utility")
  .argument("<url>")
  .option(
    "-o, --output [dir]",
    'output dir (default: "/home/user/current-dir")'
  )
  .helpOption("-h, --help", "display help for command")
  .action((url,option) => {
    saveHTML(url, option.output);
  });

program.parse();

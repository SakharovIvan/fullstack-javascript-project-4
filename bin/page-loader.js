#!/usr/bin/env node

import { Command } from "commander";

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
  .helpOption("-h, --help", "display help for command");

program.parse();

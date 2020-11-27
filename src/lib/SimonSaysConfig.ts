import fs from "fs";
import toml from "toml";
import os from "os";
import { logger } from "../utils/logger";

export class SimonSaysConfig {
  static fileName = "config.toml";
  public channels: string[];
  public polls: { title: string; answers: string[] }[];
  public defaultDuration: number;
  constructor() {
    try {
      const pathExists = fs.existsSync(`${os.homedir()}/simonsaysbot`);
      if (!pathExists) {
        fs.mkdirSync(`${os.homedir()}/simonsaysbot`);
        fs.writeFileSync(`${os.homedir()}/simonsays/config.toml`, "");
        logger.info("Please configure the bot before using it!");
        throw Error("No config file");
      }
      const config = toml.parse(
        fs.readFileSync(
          `${os.homedir()}/simonsaysbot/${SimonSaysConfig.fileName}`,
          "utf-8"
        )
      );
      if (!config.channels) {
        throw Error('Did not find list of "channels" to connect to!');
      }
      this.channels = config.channels;
      if (!config.polls || config.polls.length === 0) {
        throw Error("Did not find any polls to display for simon says!");
      }
      this.polls = config.polls;
      if (
        !config.defaultDuration ||
        typeof config.defaultDuration !== "number"
      ) {
        throw Error("You need to specify a default duration for the polls!");
      }
      this.defaultDuration = config.defaultDuration;
    } catch (err) {
      logger.error(`Could not parse config file! Exiting the program...`);
      logger.error(`Error was:\n ${err.message}`);
      process.exit(1);
    }
  }
}

import dotenv from "dotenv";
import path from "path";
import { Client } from "./lib/Client";
import { SimonSaysConfig } from "./lib/SimonSaysConfig";
const dotenvAbsolutePath = path.join(__dirname, "../.env");
dotenv.config({
  path: dotenvAbsolutePath,
});

const config = new SimonSaysConfig();
const opts = {
  identity: {
    username: String(process.env.BOT_USERNAME),
    password: String(process.env.PASSWORD),
  },
  channels: config.channels,
};

const client = new Client(opts, config);

export { client };

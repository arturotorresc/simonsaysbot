import dotenv from "dotenv";
import { Client } from "./lib/Client";
import { SimonSaysConfig } from "./lib/SimonSaysConfig";
dotenv.config();

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

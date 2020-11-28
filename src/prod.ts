import { client } from "./index";
import { logger } from "./utils/logger";
try {
  client.connect();
} catch (err) {
  logger.error("An error ocurred while connecting to the Twitch IRC chat.");
  logger.error(`Error: ${err.message}`);
}

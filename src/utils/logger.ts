import winston, { format } from "winston";
import { __PROD__ } from "../constants";
const { printf } = format;

const myFormat = printf(({ level, message }) => {
  const now = new Date();
  return `${now.getFullYear()}/${now.getMonth()}/${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: "debug",
  format: myFormat,
  transports: [new winston.transports.Console()],
});

if (__PROD__) {
  logger.add(
    new winston.transports.File({ filename: "errors.log", level: "error" })
  );
}

export { logger };

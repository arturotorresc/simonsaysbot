import tmi from "tmi.js";
import { SimonSaysCommand } from "./commands/SimonSays";
import { SimonSaysConfig } from "./SimonSaysConfig";
import { logger } from "../utils/logger";

enum AvailableCommandsEnum {
  SIMON_SAYS = "!simonsays",
  SIMON_DICE = "!simondice",
}

export class Client {
  private client: tmi.Client;
  private config: SimonSaysConfig;

  constructor(options: any, config: SimonSaysConfig) {
    this.client = tmi.client(options);
    this.config = config;
    this.onMessage = this.onMessage.bind(this);
    this.client.on("message", this.onMessage);
    this.client.on("connected", this.onConnect);
  }

  public connect() {
    this.client.connect();
  }

  private async handleCommands(
    target: string,
    context: tmi.ChatUserstate,
    msg: string
  ): Promise<void> {
    const [command, args] = this.parseCommand(msg);
    switch (command) {
      case AvailableCommandsEnum.SIMON_DICE:
      case AvailableCommandsEnum.SIMON_SAYS:
        const simonSays = new SimonSaysCommand({
          target,
          context,
          args,
          client: this.client,
          config: this.config,
        });
        await simonSays.process();
        break;
      default:
        logger.info(`Unknown command: ${command}`);
        break;
    }
  }

  private onConnect(address: string, port: number): void {
    logger.info(`Started listening on: ${address}:${port}`);
  }

  private parseCommand(command: string): [string, string[]] {
    const args = command.split(" ");
    if (args.length <= 1) {
      return [args.shift() as string, []];
    }
    return [args.shift() as string, args];
  }

  private async onMessage(
    target: string,
    context: tmi.ChatUserstate,
    msg: string,
    self: boolean
  ) {
    if (self) {
      return;
    }
    const command = msg.trim().toLowerCase();
    if (command.length === 0 || !command.startsWith("!")) {
      return;
    }
    try {
      await this.handleCommands(target, context, command);
    } catch (err) {
      logger.error(
        `An error ocurred while processing command (${command}): ${err.message}`
      );
    }
  }
}

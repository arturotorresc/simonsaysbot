import tmi from "tmi.js";
import { SimonSaysConfig } from "./SimonSaysConfig";
import { logger } from "../utils/logger";
import { second } from "../constants";

export interface IBaseCommandArgs {
  target: string;
  context: tmi.ChatUserstate;
  args: string[];
  client: tmi.Client;
  config: SimonSaysConfig;
}

export abstract class BaseCommand {
  protected readonly target: string;
  protected readonly context: tmi.ChatUserstate;
  protected readonly args: string[];
  private readonly client: tmi.Client;
  protected readonly config: SimonSaysConfig;
  // Number of messages we can send every ${messageRefreshTime} seconds.
  private static readonly messageLimit: number = 100;
  // In seconds
  private static readonly messageRefreshTime: number = 30;
  private static messageCount: number;
  private static canSendMessage: boolean = true;

  constructor(args: IBaseCommandArgs) {
    this.target = args.target;
    this.context = args.context;
    this.args = args.args;
    this.client = args.client;
    this.config = args.config;
  }

  public async process(): Promise<void> {
    try {
      if (BaseCommand.canSendMessage) {
        await this.handleProcess();
      }
    } catch (err) {
      logger.error(`An error ocurred while processing command: ${err.message}`);
    }
  }

  protected abstract handleProcess(): Promise<void>;

  protected isMod(): boolean {
    return this.context.mod || false;
  }

  protected isBroadcaster(): boolean {
    if (!this.context.badges) {
      return false;
    }
    return this.context.badges.broadcaster === "1";
  }

  protected say(msg: string) {
    if (BaseCommand.messageCount === BaseCommand.messageLimit) {
      BaseCommand.canSendMessage = false;
      setTimeout(() => {
        BaseCommand.canSendMessage = true;
        BaseCommand.messageCount = 0;
      }, second * BaseCommand.messageRefreshTime);
      return;
    }
    BaseCommand.messageCount += 1;
    this.client.say(this.target, msg);
  }

  protected delaySay(msg: string | (() => string), numberOfSeconds: number) {
    setTimeout(() => {
      if (typeof msg === "function") {
        const newMessage = msg();
        this.say(newMessage);
      } else {
        this.say(msg);
      }
    }, numberOfSeconds * second);
  }
}

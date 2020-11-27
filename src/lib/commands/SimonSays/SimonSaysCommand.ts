import { BaseCommand, IBaseCommandArgs } from "../../BaseCommand";
import { PollDB } from "./PollDB";

enum ArgsEnum {
  GO = "go",
  HELP = "help",
  OPTIONS = "options",
  RESULTS = "results",
}

export class SimonSaysCommand extends BaseCommand {
  private poll: PollDB;
  constructor(args: IBaseCommandArgs) {
    super({
      ...args,
    });
    this.poll = PollDB.Instance;
  }

  protected async handleProcess() {
    if (this.args.length === 0) {
      return;
    }

    if (
      this.args[0] === ArgsEnum.GO &&
      (this.isMod() || this.isBroadcaster())
    ) {
      this.handleGoArg();
      return;
    } else if (this.args[0] === ArgsEnum.HELP) {
      this.handleHelpArg();
      return;
    } else if (this.args[0] === ArgsEnum.OPTIONS) {
      this.handleOptionsArg();
      return;
    } else if (this.args[0] === ArgsEnum.RESULTS) {
      this.handleResultsArg();
      return;
    }

    if (!this.poll.hasStarted) {
      return;
    }
    this.handleVote();
  }

  // ============================= ARGUMENT HANDLING ============================

  private handleGoArg() {
    if (this.poll.hasStarted) {
      this.say(`Ya hay una votación activa: ${this.poll.getCurrentPoll()}`);
      return;
    }
    this.startPoll();
  }

  private handleHelpArg() {
    this.say(
      "Puedes usar !simonsays o !simondice para llamar al bot. Las opciones con las que puedes" +
        " llamar al bot son: !simonsays go [Empieza una nueva votación random | solo mods o streamer] |" +
        " !simonsays (número de opción) [Vota por una opción, puedes votar multiples veces.] |" +
        " !simonsays options [Ve las opciones que hay para votar si es que hay una votación activa] |" +
        " !simonsays results [Ve los resultados de la votación anterior]" +
        " !simonsays help [Ayuda con como utilizar el bot]"
    );
  }

  private handleResultsArg() {
    this.say(this.poll.getPastPollResults());
  }

  private handleOptionsArg() {
    if (!this.poll.hasStarted) {
      return;
    }
    this.say(`Las opciones para votar son: ${this.poll.options}`);
  }

  private handleVote() {
    const vote = Number(this.args[0]);
    if (isNaN(vote) || vote >= this.poll.numOfOptions) {
      return;
    }
    this.poll.vote(vote);
  }

  // ================================ HELPERS =====================================

  private startPoll() {
    const max = this.config.polls.length;
    const randPoll = Math.floor(Math.random() * max);
    const poll = this.config.polls[randPoll];

    this.poll.init({
      answers: poll.answers,
    });
    const pollDescription = `${this.target.slice(1) || "Streamer"} dice: ${
      poll.title
    } | Las opciones son: ${this.poll.options}`;
    this.delaySay(
      "¿Cómo votar? -> !simonsays [número de opcion sin brackets]",
      2
    );
    this.poll.setCurrentPoll(pollDescription);
    this.say(pollDescription);

    const resultFunc = this.poll.stopPollAndGetResult.bind(this.poll);
    this.delaySay(resultFunc, this.config.defaultDuration);
  }
}

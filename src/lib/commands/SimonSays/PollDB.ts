interface IPollArgs {
  answers: string[];
}

export class PollDB {
  private static _instance: PollDB;

  private currentPoll: string;
  private prevPollResult: string;
  // Keeps a map of questions to score.
  private score: Map<string, number>;
  // Keeps a map of option number to question.
  private questionNumber: Map<number, string>;
  private optionsMsg: string;
  private started: boolean;

  private constructor() {
    this.score = new Map();
    this.questionNumber = new Map();
    this.optionsMsg = "No han habido encuestas.";
    this.started = false;
  }

  public init(args: IPollArgs) {
    this.clear();
    let optionsMsg = "";
    for (let i = 0; i < args.answers.length; ++i) {
      this.score.set(args.answers[i], 0);
      this.questionNumber.set(i, args.answers[i]);
      optionsMsg += ` [${i}] -> ${args.answers[i]},`;
    }
    this.optionsMsg = optionsMsg.slice(0, -1);
    this.started = true;
  }

  public stopPollAndGetResult(): string {
    this.started = false;
    let answerWinner = "";
    let maxVotes = 0;
    this.score.forEach((value, key) => {
      if (value > maxVotes) {
        answerWinner = key;
        maxVotes = value;
      }
    });
    if (answerWinner === "") {
      answerWinner = "Nadie votó";
    }
    const pollResult = `¡Terminó la votación! Simón dice: ¡${answerWinner}!`;
    this.prevPollResult = pollResult;
    return pollResult;
  }

  public setCurrentPoll(title: string) {
    this.currentPoll = title;
  }

  public getCurrentPoll(): string {
    return this.currentPoll;
  }

  public getPastPollResults(): string {
    return this.prevPollResult;
  }

  public get options(): string {
    return this.optionsMsg;
  }

  public get hasStarted(): boolean {
    return this.started;
  }

  public get numOfOptions(): number {
    return this.questionNumber.size;
  }

  public vote(option: number) {
    if (!this.questionNumber.has(option)) {
      return;
    }
    const question = this.questionNumber.get(option);
    if (question === undefined) {
      return;
    }
    const currentScore = this.score.get(question);
    if (currentScore === undefined) {
      return;
    }
    this.score.set(question, currentScore + 1);
  }

  private clear(): void {
    this.optionsMsg = "";
    this.score.clear();
    this.questionNumber.clear();
  }

  public static get Instance(): PollDB {
    return this._instance || (this._instance = new PollDB());
  }
}

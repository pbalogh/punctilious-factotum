import { FORMULA, UNARYOPERATOR } from "../Constants";
import { IMatchable, Token } from "../Token";
import { PartOfSpeech } from "./PartOfSpeech";

export class Root extends PartOfSpeech {
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, FORMULA, "Not");
  }
  public toJSON = (): any => {
    return {
      name: this.toStringFunction(),
      attributes: {
        part: "ROOT"
      },
      children: this.relevantElements.slice(1).map(e => e.toJSON())
    };
  };
}

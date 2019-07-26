import { FORMULA, UNARYOPERATOR } from "../Constants";
import { IMatchable, Token } from "../Token";
import { PartOfSpeech } from "./PartOfSpeech";

export class Root extends PartOfSpeech {
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, FORMULA, "Not");
  }
}

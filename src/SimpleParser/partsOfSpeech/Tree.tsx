import { IMatchable } from "../Token";
import { PartOfSpeech } from "./PartOfSpeech";

export class Tree extends PartOfSpeech {
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, syntaxmatch, "Formula");
    const [first, ...rest] = elements;
    rest.pop();
    this.relevantElements = rest;
  }

  public getVarName = (): string | null => {
    return (this.elements[1] as IMatchable).getVarName();
  };

  public toStringFunction = (): string => {
    return this.elements[1].toString();
  };

  public toJSON = (): any => {
    return {
      name: this.toStringFunction(),
      attributes: {
        part: this.getPartOfSpeechDefinition(
          this.relevantElements[0].toString()
        ),
        raw: this.getTokenStrings()
      },
      children: this.relevantElements.slice(1).map(e => e.toJSON())
    };
  };
}

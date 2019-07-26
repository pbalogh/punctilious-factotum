import { IMatchable } from "../Token";
export class PartOfSpeech implements IMatchable {
  public elements: IMatchable[];
  public relevantElements: IMatchable[] = [];
  public syntaxmatch: string;
  public className: string;
  public myString?: string;
  public isModal: boolean = false;
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    this.elements = elements;
    this.syntaxmatch = syntaxmatch;
    this.className = className;
  }

  public getVarName = (): string | null => {
    return null;
  };

  public toStringFunction = (): string => {
    return this.elements.reduce(
      (acc: string, element) => acc + element.toString(),
      ""
    );
  };

  public toString = (): string => {
    // We'll memoize our string
    if (!this.myString) {
      this.myString = this.toStringFunction();
    }
    return this.myString;
  };

  public getTokenStrings() {
    // If my child is a token, return its string
    return this.relevantElements
      .slice(1)
      .map(e => e.getTokenStrings())
      .join(" ");
  }

  public getPartOfSpeechDefinition: (arg0: string) => string = abbreviation => {
    const cleanAbbreviation = abbreviation.replace(/\s/, "");
    console.log(
      "cleanAbbreviation is " +
        cleanAbbreviation +
        " of length " +
        cleanAbbreviation.length
    );
    return partsOfSpeechDefinitions[cleanAbbreviation];
  };

  public toJSON = (): any => {
    return {
      name: this.toStringFunction(),
      attributes: {
        part: this.getPartOfSpeechDefinition(
          this.relevantElements[0].toString()
        )
      },
      children: this.relevantElements.map(e => e.toJSON())
    };
  };
}

export const partsOfSpeechDefinitions: { [key: string]: string } = {
  ADJP: "Adjective phrase",
  CC: "Coordinating conjunction",
  CD: "Cardinal number",
  DT: "Determiner",
  EX: "Existential there",
  FW: "Foreign word",
  IN: "Preposition or subordinating conjunction",
  JJ: "Adjective",
  JJR: "Adjective, comparative",
  JJS: "Adjective, superlative",
  LS: "List item marker",
  MD: "Modal",
  NN: "Noun, singular or mass",
  NNS: "Noun, plural",
  NNP: "Proper noun, singular",
  NNPS: "Proper noun, plural",
  NP: "Noun phrase",
  PDT: "Predeterminer",
  POS: "Possessive ending",
  PRP: "Personal pronoun",
  PRP$: "Possessive pronoun",
  RB: "Adverb",
  RBR: "Adverb, comparative",
  RBS: "Adverb, superlative",
  ROOT: "Root",
  RP: "Particle",
  S: "Sentence",
  SYM: "Symbol",
  TO: "to",
  UH: "Interjection",
  VB: "Verb, base form",
  VBD: "Verb, past tense",
  VBG: "Verb, gerund or present participle",
  VBN: "Verb, past participle",
  VBP: "Verb, non­3rd person singular present",
  VBZ: "Verb, 3rd person singular present",
  VP: "Verb phrase",
  WDT: "Wh­determiner",
  WP: "Wh­pronoun",
  WP$: "Possessive wh­pronoun",
  WRB: "Wh­adverb",
  ".": "Sentence terminator"
};

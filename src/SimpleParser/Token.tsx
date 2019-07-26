import {
  BINARYOPERATOR,
  CLOSEPARENS,
  OPENPARENS,
  UNARYOPERATOR,
  VARIABLE,
  PART,
  WORD,
  PUNCTUATION
} from "./Constants";

export interface IMatchable {
  className: string;
  elements: string | IMatchable[];
  syntaxmatch: string;
  toString(): string;
  getTokenStrings(): string;
  getVarName(): string | null;
  toJSON(): any;
}

export interface IMatchableMap {
  [key: string]: IMatchable;
}

export type MatchableArgs = [IMatchable[], string, any];

export interface IStateInterface {
  [key: string]: boolean;
}

export class Token implements IMatchable {
  constructor(
    public regex: RegExp,
    public syntaxmatch: string,
    public className: any,
    public elements: string
  ) {}

  public getVarName = (): string | null => {
    return this.elements;
  };

  public toString = (): string => {
    return this.elements;
  };

  public getTokenStrings = (): string => {
    return this.elements;
  };

  public toJSON = (): any => {
    return { name: this.elements };
  };
}

const mapAbbreviationToPart = {};

export const allKnownTokens: Token[] = [
  new Token(/^\(/, OPENPARENS, "Formula", "("),
  new Token(/^\)/, CLOSEPARENS, "Formula", ")"),

  //   new Token(/^ROOT\b/, PART, "Root", "->"),
  //   new Token(/^S\b/, PART, "Sentence", "->"),
  //   new Token(/^NP\b/, PART, "NounPhrase", "->"),
  //   new Token(/^VP\b/, PART, "VerbPhrase", "->"),
  //   new Token(/^DT\b/, PART, "Determinant", "->"),
  //   new Token(/^NN\b/, PART, "Noun", "->"),
  //   new Token(/^ADJP\b/, PART, "AdjectivePhrase", "->"),
  //   new Token(/^VBZ\b/, PART, "Verb", "->"),
  new Token(/^(ROOT|S)\b/, PART, "Verb", "->"),
  new Token(
    /^(ADJP|ADVP|CC|CD|DT|EX|FW|IN|JJ|JJR|JJS|LS|MD|NN|NP|NNS|NNP|NNPS|PDT|POS|PP|PRP|PRP$|RB|RBR|RBS|RP|SYM|TO|UH|VB|VBD|VBG|VBN|VBP|VBZ|VP|WDT|WP|WP$|WRB)\b/,
    PART,
    "Adjective",
    "->"
  ),

  new Token(/^[a-zA-Z0-9]+/, WORD, "Variable", "Var"),
  new Token(/^\W/, PUNCTUATION, "Punctuation", "->")
];

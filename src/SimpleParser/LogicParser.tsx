import PartsOfSpeechRepository from "./PartsOfSpeechRepository";
import {
  BINARYOPERATOR,
  CLOSEPARENS,
  FORMULA,
  OPENPARENS,
  UNARYOPERATOR,
  VARIABLE,
  PART,
  WORD,
  TREE,
  PUNCTUATION
} from "./Constants";
import Pattern from "./Pattern";
import { allKnownTokens, IMatchable, Token } from "./Token";
import { PartOfSpeech } from "./partsOfSpeech/PartOfSpeech";

const patterns = [
  /*

  There are a few kinds of trees.
  The ones that are PART and TREE,
  the ones that are PART and WORD,
  and the ones that are PUNCTUATION and PUNCTUATION.

  All start with ( and end with )

  */

  new Pattern(
    [OPENPARENS, PART, WORD, CLOSEPARENS],
    TREE,
    (matches: IMatchable[]) => "Tree"
  ),
  new Pattern(
    [OPENPARENS, PUNCTUATION, PUNCTUATION, CLOSEPARENS],
    TREE,
    (matches: IMatchable[]) => "Tree"
  ),
  new Pattern(
    [OPENPARENS, PART, CLOSEPARENS],
    TREE,
    (matches: IMatchable[]) => "Tree"
  ),
  new Pattern(
    [OPENPARENS, PART, TREE, CLOSEPARENS],
    TREE,
    (matches: IMatchable[]) => "Tree"
  ),
  new Pattern(
    [OPENPARENS, PART, TREE, TREE, CLOSEPARENS],
    TREE,
    (matches: IMatchable[]) => "Tree"
  ),
  new Pattern(
    [OPENPARENS, PART, TREE, TREE, TREE, CLOSEPARENS],
    TREE,
    (matches: IMatchable[]) => "Tree"
  )
];

const defaultState = {
  A: true,
  B: false
};

export default class LogicParser {
  formulae: IMatchable[] = [];
  public whitespaceRegex = RegExp(/^\s/);
  //   public formulae: IMatchable[];
  public foundAMatch: boolean = false;
  constructor(public sentence: string) {
    const cleanSentence = sentence;
    const tokens = this.tokenizeSentence(cleanSentence);
    console.log("Done, and tokens is ", tokens);
    console.log("-------------------");
    this.formulae = this.parseTokensAndFormulae(tokens);
    console.log("formulae are ", this.formulae);
    console.log(
      "formulae[0].toJSON() is ",
      JSON.stringify(this.formulae[0].toJSON())
    );
    /*

    console.log(
      ">>>>>> this.formulae[0].evaluate() is ",
      this.formulae[0].evaluate(state)
    );
    */
  }

  public parseTokensAndFormulae(tokens: IMatchable[]) {
    if (tokens.length === 0) {
      return [];
    }

    let remainingTokens = [...tokens];

    do {
      this.foundAMatch = false;
      for (const pattern of patterns) {
        // We want to keep applying the pattern
        // for as long as it is fruitful.

        remainingTokens = this.substitutePatternInSentence(
          pattern,
          remainingTokens
        );
      }
    } while (this.foundAMatch && remainingTokens.length > 1);

    return remainingTokens;
  }

  /**
   *
   * @param {tokens}
   * This function takes an array of tokens-or-formulae,
   * and returns an array of tokens-or-formulae.
   * When successful, it should replace at least one token with at least one formula.
   * (Some formulae encompass more than one token-or-formula object,
   * so you might replace 3 token-or-formula objects
   * with a single new formula object.)
   *
   * NOTE: Not every pattern will be found in every possible sentence of tokens, of course.
   */
  public substitutePatternInSentence(
    pattern: Pattern,
    tokens: IMatchable[]
  ): IMatchable[] {
    // The design here is that we recurse.
    // It's straight out of The Little Schemer.
    // We return the match on the first character concat
    // with the match on the *rest* of the characters.
    if (tokens.length === 0) {
      return [];
    }
    const matchedTokens = [];
    let matchedPattern;
    for (let i = 0; i < pattern.elements.length; i++) {
      // what if the pattern happens to be longer than the sentence of tokens??
      // It's literally impossible for this pattern to match.
      if (i >= tokens.length) {
        return tokens;
      }
      // If we hit a tokenOrFormula that doesn't match our pattern,
      // we know this isn't a match.
      // So we'll make a return-array with the first token at its lead,
      // and append to it an attempted match with the *rest* of our sentence.
      if (tokens[i].syntaxmatch !== pattern.elements[i]) {
        return [
          tokens[0],
          ...this.substitutePatternInSentence(pattern, tokens.slice(1))
        ];
      } else {
        matchedPattern = pattern;
        matchedTokens.push(tokens[i]);
      }
    }

    // Still here? Then congrats! We matched the whole pattern!
    this.foundAMatch = true;
    // elements, syntaxmatch, valueFunc
    // TODO: We need to get the classname from our token here.
    // And make sure it gets passed into our formula,
    // so that "!!A" does make Not -> Not ->

    if (!matchedPattern) {
      return [];
    }

    // A Pattern's classref is a function,
    // because the class for a pattern is different depending on which pattern it is.
    // !A is UNARYOPERATOR, FORMULA -- so it needs to get the classref from the first object.
    const className: string = matchedPattern.getClassName(matchedTokens);

    console.log("className is ", className);
    console.log("And syntaxMatch is ", matchedPattern.syntaxmatch);

    const POSClassConstructor = PartsOfSpeechRepository[className];

    const partOfSpeech: PartOfSpeech = new POSClassConstructor(
      matchedTokens,
      matchedPattern.syntaxmatch,
      className
    );

    const remainingTokensFromMatch = tokens.slice(matchedTokens.length);

    return [
      partOfSpeech,
      ...this.substitutePatternInSentence(pattern, remainingTokensFromMatch)
    ];
  }

  public tokenizeSentence(sentence: string): Token[] {
    // Again, the design here is that we recurse.
    // It's straight out of The Little Schemer.
    // We return the match on the first character
    // at the front of our array,
    // and the rest of the array
    // is the match on the *rest* of the characters.

    // Recursion needs a base case.
    // Here, if we're done (the sentence is empty), don't recurse any more!
    if (sentence.length < 1) {
      return [];
    }

    const whitespaceAtBeginning = this.whitespaceRegex.exec(sentence);
    if (whitespaceAtBeginning) {
      return this.tokenizeSentence(
        sentence.slice(whitespaceAtBeginning[0].length)
      );
    }

    let matchedToken: Token;
    let restOfSentence: string;

    for (const token of allKnownTokens) {
      const match = token.regex.exec(sentence);
      if (match) {
        matchedToken = new Token(
          token.regex,
          token.syntaxmatch,
          token.className,
          match[0]
        );
        restOfSentence = sentence.substring(match[0].length);
        // Here it is: one array, with our (known) match up front
        // and our (unknown) future matches following.
        return [matchedToken, ...this.tokenizeSentence(restOfSentence)];
      }
    }
    return [];
  }
}

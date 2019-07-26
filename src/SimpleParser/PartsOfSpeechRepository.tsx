import { PartOfSpeech } from "./partsOfSpeech/PartOfSpeech";
import { IMatchable } from "./Token";
import { Root } from "./partsOfSpeech/Root";
import { Tree } from "./partsOfSpeech/Tree";

export interface IPartsOfSpeechInterface {
  [key: string]: PartOfSpeechConstructor;
}

interface PartOfSpeechConstructor {
  new (
    elements: IMatchable[],
    syntaxmatch: string,
    className: string
  ): PartOfSpeech;
}

const PartsOfSpeechRepository: IPartsOfSpeechInterface = {
  Root,
  Tree,
  PartOfSpeech
};

export default PartsOfSpeechRepository;

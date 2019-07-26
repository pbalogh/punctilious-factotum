import React, { useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import BarChart from "./BarChart";
import LogicParser from "./SimpleParser/LogicParser";
import TreeChart from "./TreeChart";
import { IMatchable } from "./SimpleParser/Token";

function App() {
  const [formulaeTree, setFormulae] = useState<IMatchable[]>([]);
  const [sentenceToParse, setSentenceToParse] = useState("");
  const [parsed, setParsed] = useState("");
  const inputEl = useRef<HTMLTextAreaElement>(null);

  const onInputChange = (e: any) => {
    setSentenceToParse(inputEl.current!.value);
    let cheerio = require("cheerio");
    var proxyUrl = "https://cors-anywhere.herokuapp.com/",
      targetUrl =
        "http://nlp.stanford.edu:8080/parser/index.jsp?query=" +
        inputEl.current!.value;
    fetch(proxyUrl + targetUrl)
      .then(blob => blob.text())
      .then(response => {
        // console.log("response is ", response);
        let $ = cheerio.load(response);
        console.log('$("#parse").text() is ', $("#parse").text());
        setParsed($("#parse").text());
        const logicParser = new LogicParser($("#parse").text());
        setFormulae(logicParser.formulae);

        console.log("logicParser.formulae is ", logicParser.formulae);
      });
  };
  console.log("outside of fetch, formulaeTree is ", formulaeTree);

  // http://nlp.stanford.edu:8080/parser/index.jsp?query=John%E2%80%99s%20leg%20is%20broken%20because%20Mary%20knocked%20over%20a%20pile%20of%20bricks.
  return (
    <div className="App">
      <textarea ref={inputEl} />
      <button onClick={onInputChange}>Click to parse</button>
      {formulaeTree[0] && (
        <TreeChart width={window.innerWidth} height={window.innerHeight} data={formulaeTree[0].toJSON()} />
      )}
    </div>
  );
}

const sentence1 = "The dog is blue.";

const sentence2 = "The dog is hungry.";

const parsed1 = `(ROOT
    (S
      (NP (DT The) (NN dog))
      (VP (VBZ is)
        (ADJP (JJ blue)))
      (. .)))`;

const parsed2 = `(ROOT
    (S
      (NP (DT The) (NN dog))
      (VP (VBZ is)
        (ADJP (JJ hungry)))
      (. .)))`;

export default App;
/*
http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.9.8216&rep=rep1&type=pdf

CC Coordinating conjunction
CD Cardinal number
DT Determiner
EX Existential there
FW Foreign word
IN Preposition or subordinating conjunction
JJ Adjective
JJR Adjective, comparative
JJS Adjective, superlative
LS List item marker
MD Modal
NN Noun, singular or mass
NNS Noun, plural
NNP Proper noun, singular
NNPS Proper noun, plural
PDT Predeterminer
POS Possessive ending
PRP Personal pronoun
PRP$ Possessive pronoun
RB Adverb
RBR Adverb, comparative
RBS Adverb, superlative
RP Particle
SYM Symbol
TO to
UH Interjection
VB Verb, base form
VBD Verb, past tense
VBG Verb, gerund or present participle
VBN Verb, past participle
VBP Verb, non­3rd person singular present
VBZ Verb, 3rd person singular present
WDT Wh­determiner
WP Wh­pronoun
WP$ Possessive wh­pronoun
WRB Wh­adverb
. Sentence-final punctuation
: Colon, semi-colon
( Left bracket character
) Right bracket character 
" Straight double quote
‘ Left open single quote
“ Left open double quote
” Right close double quo
’ Right close single quote
# Pound sign
$ Dollar sign
*/

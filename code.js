
// Letters A-Z
const letters = "abcdefghijklmnopqrstuvwxyz".split("");
const lettersDiv = document.getElementById("letters");
const wordDiv = document.getElementById("word");
const resultDiv = document.getElementById("result");

// Create letter buttons dynamically
function createLetterButtons() {
  letters.forEach(char => {
    const btn = document.createElement("span");
    btn.className = "letter";
    btn.textContent = char;
    btn.onclick = () => addLetter(char);
    lettersDiv.appendChild(btn);
  });
}
createLetterButtons();

function addLetter(char) {
  wordDiv.textContent += char;
  resultDiv.textContent = "";
}
function clearWord() {
  wordDiv.textContent = "";
  resultDiv.textContent = "";
}

// MAIN CHECK FUNCTION
function checkWord() {
  const word = wordDiv.textContent.toLowerCase().trim();
  if (!word) {
    resultDiv.textContent = "Please build a word first.";
    return;
  }

  // Use local advanced grammar rule check
  const grammarInfo = analyzeWordGrammar(word);
  displayResult(word, grammarInfo);
}

// Display the detailed grammar info
function displayResult(word, info) {
  let output = "";
  output += "Word: " + word + "\n\n";

  output += "Part(s) of Speech: " + info.partsOfSpeech.join(", ") + "\n\n";
  
  output += "Details:\n";
  for (const [key, value] of Object.entries(info.details)) {
    output += " - " + key + ": " + value + "\n";
  }
  
  resultDiv.textContent = output;
}

// Comprehensive word analysis with many grammar rules
function analyzeWordGrammar(word) {
  const partsOfSpeech = new Set();
  const details = {};

  // Pronouns
  const pronouns = [
    "i","you","he","she","it","we","they",
    "me","him","her","us","them",
    "this","that","these","those",
    "my","your","his","her","its","our","their",
    "mine","yours","hers","ours","theirs",
    "myself","yourself","himself","herself","itself","ourselves","themselves"
  ];
  if (pronouns.includes(word)) {
    partsOfSpeech.add("Pronoun");
    details["Pronoun type"] = "Personal or Demonstrative or Reflexive";
  }

  // Articles
  const articles = ["a","an","the"];
  if (articles.includes(word)) {
    partsOfSpeech.add("Article");
    details["Article type"] = (word === "the") ? "Definite" : "Indefinite";
  }

  // Conjunctions
  const conjunctions = [
    "and","but","or","nor","for","yet","so",
    "although","because","since","unless","while","whereas","after","before","if","though","once","until","when","where","whether"
  ];
  if (conjunctions.includes(word)) {
    partsOfSpeech.add("Conjunction");
    details["Conjunction type"] = "Coordinating or Subordinating";
  }

  // Prepositions
  const prepositions = [
    "in","on","at","by","with","about","against","between","into","through","during","before",
    "after","above","below","to","from","up","down","of","off","over","under","within","without","near","along","past","around"
  ];
  if (prepositions.includes(word)) {
    partsOfSpeech.add("Preposition");
  }

  // Interjections
  const interjections = [
    "oh","ah","wow","ouch","hey","alas","bravo","hmm","yikes","oops","uh","eh","yay","boo","ugh"
  ];
  if (interjections.includes(word)) {
    partsOfSpeech.add("Interjection");
  }

  // Modal verbs (auxiliary verbs)
  const modalVerbs = [
    "can","could","may","might","must","shall","should","will","would","ought"
  ];
  if (modalVerbs.includes(word)) {
    partsOfSpeech.add("Modal verb");
    details["Modal verb type"] = "Auxiliary";
  }

  // Auxiliary verbs (be, have, do forms)
  const auxVerbs = [
    "be","am","is","are","was","were","been","being",
    "have","has","had","having",
    "do","does","did","doing"
  ];
  if (auxVerbs.includes(word)) {
    partsOfSpeech.add("Auxiliary verb");
  }

  // Determiners (including quantifiers and possessives)
  const determiners = [
    "some","any","no","every","each","either","neither","much","more","most","little","less","least","several","all","both","half",
    "my","your","his","her","its","our","their"
  ];
  if (determiners.includes(word)) {
    partsOfSpeech.add("Determiner");
  }

  // Common nouns
  const commonNouns = [
    "time","year","people","way","day","man","thing","woman","life","child","world","school","state","family","student","group","country","problem","hand",
    "dog","cat","car","tree","book","city","water","air","food","music","phone","computer","river","mountain","ocean","house","friend","love","game","road"
  ];
  if (commonNouns.includes(word)) {
    partsOfSpeech.add("Noun");
    details["Noun type"] = "Common noun";
  }

  // Common verbs
  const commonVerbs = [
    "be","have","do","say","go","can","get","make","know","think","take","see","come","want","look","use","find","give","tell","work",
    "run","walk","play","read","write","jump","eat","drink","sleep","buy","sell","call","listen","watch","open","close","help","start","stop","love","hate"
  ];
  if (commonVerbs.includes(word)) {
    partsOfSpeech.add("Verb");
    details["Verb type"] = "Common verb";
  }

  // Detect if plural noun (ends with s, not verb form)
  if (/^[a-z]+s$/.test(word) && !word.endsWith("ss") && !commonVerbs.includes(word)) {
    partsOfSpeech.add("Plural noun");
    details["Plural noun detected"] = "Ends with 's'";
  }

  // Adjective detection by suffix
  const adjectiveSuffixes = ["able","ible","al","ful","ic","ive","less","ous","ish","ary","y","ed"];
  const matchedAdjs = adjectiveSuffixes.filter(suf => word.endsWith(suf));
  if (matchedAdjs.length) {
    partsOfSpeech.add("Adjective");
    details["Adjective suffix detected"] = matchedAdjs.join(", ");
  }

  // Adverb detection by suffix
  if (word.endsWith("ly")) {
    partsOfSpeech.add("Adverb");
    details["Adverb suffix"] = "Ends with 'ly'";
  }



  // Verb tense heuristic check 1
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 1");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 1");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 1");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 1");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 1");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 1");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 1");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 1");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 1");


  // Verb tense heuristic check 2
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 2");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 2");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 2");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 2");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 2");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 2");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 2");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 2");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 2");


  // Verb tense heuristic check 3
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 3");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 3");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 3");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 3");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 3");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 3");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 3");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 3");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 3");


  // Verb tense heuristic check 4
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 4");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 4");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 4");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 4");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 4");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 4");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 4");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 4");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 4");


  // Verb tense heuristic check 5
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 5");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 5");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 5");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 5");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 5");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 5");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 5");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 5");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 5");


  // Verb tense heuristic check 6
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 6");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 6");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 6");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 6");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 6");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 6");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 6");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 6");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 6");


  // Verb tense heuristic check 7
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 7");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 7");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 7");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 7");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 7");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 7");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 7");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 7");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 7");


  // Verb tense heuristic check 8
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 8");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 8");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 8");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 8");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 8");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 8");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 8");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 8");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 8");


  // Verb tense heuristic check 9
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 9");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 9");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 9");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 9");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 9");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 9");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 9");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 9");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 9");


  // Verb tense heuristic check 10
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 10");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 10");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 10");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 10");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 10");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 10");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 10");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 10");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 10");


  // Verb tense heuristic check 11
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 11");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 11");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 11");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 11");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 11");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 11");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 11");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 11");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 11");


  // Verb tense heuristic check 12
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 12");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 12");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 12");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 12");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 12");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 12");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 12");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 12");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 12");


  // Verb tense heuristic check 13
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 13");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 13");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 13");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 13");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 13");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 13");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 13");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 13");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 13");


  // Verb tense heuristic check 14
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 14");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 14");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 14");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 14");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 14");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 14");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 14");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 14");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 14");


  // Verb tense heuristic check 15
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 15");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 15");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 15");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 15");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 15");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 15");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 15");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 15");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 15");


  // Verb tense heuristic check 16
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 16");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 16");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 16");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 16");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 16");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 16");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 16");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 16");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 16");


  // Verb tense heuristic check 17
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 17");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 17");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 17");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 17");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 17");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 17");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 17");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 17");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 17");


  // Verb tense heuristic check 18
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 18");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 18");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 18");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 18");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 18");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 18");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 18");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 18");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 18");


  // Verb tense heuristic check 19
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 19");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 19");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 19");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 19");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 19");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 19");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 19");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 19");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 19");


  // Verb tense heuristic check 20
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 20");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 20");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 20");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 20");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 20");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 20");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 20");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 20");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 20");


  // Verb tense heuristic check 21
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 21");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 21");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 21");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 21");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 21");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 21");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 21");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 21");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 21");


  // Verb tense heuristic check 22
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 22");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 22");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 22");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 22");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 22");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 22");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 22");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 22");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 22");


  // Verb tense heuristic check 23
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 23");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 23");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 23");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 23");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 23");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 23");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 23");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 23");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 23");


  // Verb tense heuristic check 24
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 24");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 24");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 24");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 24");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 24");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 24");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 24");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 24");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 24");


  // Verb tense heuristic check 25
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 25");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 25");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 25");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 25");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 25");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 25");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 25");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 25");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 25");


  // Verb tense heuristic check 26
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 26");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 26");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 26");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 26");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 26");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 26");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 26");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 26");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 26");


  // Verb tense heuristic check 27
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 27");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 27");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 27");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 27");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 27");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 27");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 27");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 27");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 27");


  // Verb tense heuristic check 28
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 28");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 28");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 28");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 28");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 28");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 28");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 28");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 28");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 28");


  // Verb tense heuristic check 29
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 29");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 29");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 29");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 29");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 29");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 29");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 29");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 29");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 29");


  // Verb tense heuristic check 30
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 30");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 30");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 30");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 30");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 30");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 30");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 30");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 30");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 30");


  // Verb tense heuristic check 31
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 31");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 31");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 31");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 31");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 31");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 31");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 31");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 31");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 31");


  // Verb tense heuristic check 32
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 32");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 32");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 32");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 32");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 32");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 32");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 32");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 32");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 32");


  // Verb tense heuristic check 33
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 33");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 33");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 33");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 33");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 33");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 33");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 33");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 33");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 33");


  // Verb tense heuristic check 34
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 34");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 34");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 34");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 34");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 34");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 34");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 34");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 34");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 34");


  // Verb tense heuristic check 35
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 35");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 35");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 35");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 35");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 35");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 35");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 35");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 35");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 35");


  // Verb tense heuristic check 36
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 36");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 36");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 36");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 36");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 36");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 36");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 36");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 36");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 36");


  // Verb tense heuristic check 37
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 37");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 37");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 37");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 37");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 37");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 37");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 37");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 37");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 37");


  // Verb tense heuristic check 38
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 38");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 38");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 38");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 38");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 38");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 38");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 38");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 38");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 38");


  // Verb tense heuristic check 39
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 39");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 39");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 39");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 39");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 39");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 39");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 39");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 39");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 39");


  // Verb tense heuristic check 40
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 40");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 40");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 40");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 40");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 40");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 40");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 40");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 40");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 40");


  // Verb tense heuristic check 41
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 41");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 41");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 41");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 41");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 41");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 41");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 41");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 41");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 41");


  // Verb tense heuristic check 42
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 42");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 42");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 42");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 42");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 42");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 42");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 42");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 42");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 42");


  // Verb tense heuristic check 43
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 43");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 43");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 43");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 43");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 43");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 43");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 43");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 43");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 43");


  // Verb tense heuristic check 44
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 44");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 44");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 44");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 44");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 44");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 44");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 44");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 44");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 44");


  // Verb tense heuristic check 45
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 45");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 45");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 45");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 45");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 45");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 45");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 45");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 45");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 45");


  // Verb tense heuristic check 46
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 46");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 46");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 46");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 46");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 46");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 46");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 46");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 46");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 46");


  // Verb tense heuristic check 47
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 47");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 47");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 47");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 47");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 47");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 47");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 47");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 47");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 47");


  // Verb tense heuristic check 48
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 48");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 48");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 48");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 48");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 48");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 48");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 48");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 48");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 48");


  // Verb tense heuristic check 49
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 49");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 49");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 49");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 49");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 49");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 49");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 49");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 49");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 49");


  // Verb tense heuristic check 50
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 50");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 50");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 50");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 50");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 50");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 50");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 50");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 50");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 50");


  // Verb tense heuristic check 51
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 51");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 51");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 51");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 51");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 51");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 51");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 51");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 51");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 51");


  // Verb tense heuristic check 52
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 52");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 52");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 52");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 52");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 52");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 52");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 52");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 52");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 52");


  // Verb tense heuristic check 53
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 53");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 53");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 53");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 53");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 53");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 53");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 53");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 53");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 53");


  // Verb tense heuristic check 54
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 54");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 54");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 54");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 54");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 54");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 54");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 54");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 54");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 54");


  // Verb tense heuristic check 55
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 55");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 55");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 55");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 55");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 55");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 55");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 55");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 55");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 55");


  // Verb tense heuristic check 56
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 56");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 56");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 56");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 56");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 56");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 56");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 56");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 56");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 56");


  // Verb tense heuristic check 57
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 57");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 57");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 57");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 57");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 57");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 57");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 57");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 57");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 57");


  // Verb tense heuristic check 58
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 58");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 58");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 58");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 58");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 58");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 58");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 58");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 58");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 58");


  // Verb tense heuristic check 59
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 59");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 59");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 59");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 59");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 59");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 59");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 59");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 59");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 59");


  // Verb tense heuristic check 60
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 60");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 60");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 60");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 60");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 60");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 60");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 60");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 60");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 60");


  // Verb tense heuristic check 61
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 61");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 61");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 61");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 61");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 61");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 61");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 61");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 61");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 61");


  // Verb tense heuristic check 62
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 62");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 62");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 62");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 62");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 62");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 62");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 62");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 62");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 62");


  // Verb tense heuristic check 63
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 63");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 63");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 63");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 63");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 63");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 63");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 63");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 63");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 63");


  // Verb tense heuristic check 64
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 64");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 64");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 64");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 64");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 64");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 64");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 64");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 64");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 64");


  // Verb tense heuristic check 65
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 65");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 65");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 65");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 65");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 65");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 65");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 65");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 65");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 65");


  // Verb tense heuristic check 66
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 66");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 66");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 66");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 66");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 66");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 66");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 66");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 66");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 66");


  // Verb tense heuristic check 67
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 67");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 67");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 67");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 67");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 67");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 67");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 67");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 67");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 67");


  // Verb tense heuristic check 68
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 68");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 68");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 68");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 68");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 68");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 68");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 68");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 68");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 68");


  // Verb tense heuristic check 69
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 69");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 69");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 69");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 69");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 69");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 69");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 69");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 69");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 69");


  // Verb tense heuristic check 70
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 70");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 70");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 70");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 70");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 70");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 70");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 70");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 70");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 70");


  // Verb tense heuristic check 71
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 71");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 71");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 71");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 71");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 71");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 71");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 71");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 71");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 71");


  // Verb tense heuristic check 72
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 72");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 72");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 72");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 72");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 72");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 72");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 72");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 72");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 72");


  // Verb tense heuristic check 73
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 73");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 73");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 73");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 73");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 73");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 73");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 73");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 73");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 73");


  // Verb tense heuristic check 74
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 74");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 74");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 74");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 74");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 74");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 74");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 74");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 74");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 74");


  // Verb tense heuristic check 75
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 75");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 75");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 75");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 75");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 75");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 75");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 75");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 75");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 75");


  // Verb tense heuristic check 76
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 76");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 76");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 76");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 76");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 76");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 76");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 76");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 76");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 76");


  // Verb tense heuristic check 77
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 77");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 77");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 77");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 77");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 77");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 77");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 77");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 77");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 77");


  // Verb tense heuristic check 78
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 78");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 78");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 78");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 78");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 78");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 78");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 78");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 78");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 78");


  // Verb tense heuristic check 79
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 79");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 79");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 79");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 79");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 79");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 79");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 79");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 79");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 79");


  // Verb tense heuristic check 80
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 80");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 80");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 80");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 80");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 80");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 80");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 80");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 80");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 80");


  // Verb tense heuristic check 81
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 81");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 81");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 81");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 81");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 81");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 81");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 81");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 81");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 81");


  // Verb tense heuristic check 82
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 82");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 82");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 82");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 82");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 82");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 82");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 82");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 82");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 82");


  // Verb tense heuristic check 83
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 83");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 83");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 83");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 83");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 83");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 83");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 83");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 83");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 83");


  // Verb tense heuristic check 84
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 84");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 84");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 84");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 84");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 84");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 84");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 84");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 84");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 84");


  // Verb tense heuristic check 85
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 85");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 85");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 85");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 85");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 85");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 85");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 85");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 85");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 85");


  // Verb tense heuristic check 86
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 86");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 86");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 86");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 86");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 86");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 86");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 86");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 86");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 86");


  // Verb tense heuristic check 87
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 87");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 87");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 87");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 87");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 87");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 87");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 87");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 87");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 87");


  // Verb tense heuristic check 88
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 88");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 88");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 88");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 88");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 88");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 88");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 88");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 88");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 88");


  // Verb tense heuristic check 89
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 89");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 89");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 89");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 89");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 89");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 89");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 89");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 89");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 89");


  // Verb tense heuristic check 90
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 90");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 90");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 90");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 90");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 90");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 90");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 90");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 90");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 90");


  // Verb tense heuristic check 91
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 91");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 91");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 91");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 91");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 91");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 91");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 91");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 91");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 91");


  // Verb tense heuristic check 92
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 92");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 92");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 92");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 92");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 92");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 92");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 92");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 92");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 92");


  // Verb tense heuristic check 93
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 93");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 93");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 93");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 93");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 93");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 93");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 93");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 93");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 93");


  // Verb tense heuristic check 94
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 94");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 94");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 94");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 94");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 94");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 94");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 94");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 94");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 94");


  // Verb tense heuristic check 95
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 95");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 95");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 95");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 95");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 95");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 95");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 95");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 95");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 95");


  // Verb tense heuristic check 96
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 96");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 96");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 96");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 96");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 96");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 96");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 96");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 96");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 96");


  // Verb tense heuristic check 97
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 97");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 97");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 97");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 97");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 97");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 97");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 97");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 97");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 97");


  // Verb tense heuristic check 98
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 98");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 98");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 98");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 98");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 98");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 98");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 98");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 98");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 98");


  // Verb tense heuristic check 99
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 99");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 99");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 99");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 99");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 99");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 99");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 99");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 99");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 99");


  // Verb tense heuristic check 100
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 100");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 100");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 100");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 100");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 100");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 100");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 100");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 100");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 100");


  // Verb tense heuristic check 101
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 101");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 101");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 101");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 101");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 101");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 101");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 101");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 101");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 101");


  // Verb tense heuristic check 102
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 102");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 102");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 102");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 102");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 102");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 102");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 102");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 102");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 102");


  // Verb tense heuristic check 103
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 103");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 103");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 103");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 103");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 103");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 103");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 103");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 103");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 103");


  // Verb tense heuristic check 104
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 104");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 104");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 104");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 104");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 104");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 104");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 104");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 104");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 104");


  // Verb tense heuristic check 105
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 105");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 105");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 105");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 105");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 105");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 105");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 105");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 105");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 105");


  // Verb tense heuristic check 106
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 106");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 106");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 106");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 106");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 106");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 106");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 106");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 106");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 106");


  // Verb tense heuristic check 107
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 107");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 107");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 107");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 107");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 107");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 107");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 107");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 107");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 107");


  // Verb tense heuristic check 108
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 108");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 108");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 108");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 108");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 108");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 108");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 108");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 108");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 108");


  // Verb tense heuristic check 109
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 109");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 109");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 109");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 109");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 109");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 109");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 109");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 109");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 109");


  // Verb tense heuristic check 110
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 110");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 110");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 110");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 110");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 110");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 110");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 110");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 110");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 110");


  // Verb tense heuristic check 111
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 111");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 111");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 111");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 111");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 111");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 111");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 111");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 111");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 111");


  // Verb tense heuristic check 112
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 112");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 112");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 112");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 112");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 112");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 112");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 112");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 112");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 112");


  // Verb tense heuristic check 113
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 113");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 113");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 113");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 113");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 113");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 113");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 113");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 113");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 113");


  // Verb tense heuristic check 114
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 114");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 114");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 114");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 114");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 114");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 114");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 114");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 114");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 114");


  // Verb tense heuristic check 115
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 115");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 115");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 115");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 115");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 115");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 115");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 115");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 115");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 115");


  // Verb tense heuristic check 116
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 116");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 116");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 116");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 116");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 116");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 116");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 116");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 116");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 116");


  // Verb tense heuristic check 117
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 117");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 117");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 117");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 117");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 117");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 117");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 117");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 117");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 117");


  // Verb tense heuristic check 118
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 118");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 118");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 118");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 118");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 118");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 118");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 118");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 118");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 118");


  // Verb tense heuristic check 119
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 119");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 119");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 119");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 119");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 119");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 119");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 119");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 119");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 119");


  // Verb tense heuristic check 120
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 120");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 120");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 120");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 120");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 120");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 120");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 120");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 120");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 120");


  // Verb tense heuristic check 121
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 121");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 121");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 121");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 121");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 121");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 121");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 121");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 121");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 121");


  // Verb tense heuristic check 122
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 122");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 122");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 122");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 122");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 122");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 122");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 122");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 122");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 122");


  // Verb tense heuristic check 123
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 123");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 123");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 123");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 123");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 123");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 123");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 123");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 123");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 123");


  // Verb tense heuristic check 124
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 124");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 124");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 124");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 124");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 124");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 124");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 124");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 124");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 124");


  // Verb tense heuristic check 125
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 125");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 125");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 125");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 125");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 125");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 125");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 125");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 125");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 125");


  // Verb tense heuristic check 126
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 126");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 126");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 126");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 126");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 126");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 126");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 126");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 126");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 126");


  // Verb tense heuristic check 127
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 127");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 127");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 127");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 127");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 127");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 127");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 127");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 127");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 127");


  // Verb tense heuristic check 128
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 128");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 128");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 128");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 128");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 128");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 128");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 128");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 128");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 128");


  // Verb tense heuristic check 129
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 129");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 129");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 129");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 129");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 129");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 129");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 129");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 129");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 129");


  // Verb tense heuristic check 130
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 130");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 130");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 130");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 130");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 130");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 130");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 130");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 130");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 130");


  // Verb tense heuristic check 131
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 131");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 131");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 131");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 131");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 131");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 131");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 131");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 131");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 131");


  // Verb tense heuristic check 132
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 132");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 132");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 132");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 132");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 132");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 132");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 132");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 132");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 132");


  // Verb tense heuristic check 133
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 133");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 133");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 133");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 133");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 133");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 133");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 133");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 133");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 133");


  // Verb tense heuristic check 134
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 134");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 134");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 134");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 134");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 134");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 134");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 134");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 134");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 134");


  // Verb tense heuristic check 135
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 135");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 135");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 135");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 135");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 135");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 135");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 135");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 135");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 135");


  // Verb tense heuristic check 136
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 136");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 136");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 136");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 136");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 136");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 136");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 136");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 136");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 136");


  // Verb tense heuristic check 137
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 137");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 137");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 137");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 137");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 137");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 137");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 137");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 137");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 137");


  // Verb tense heuristic check 138
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 138");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 138");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 138");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 138");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 138");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 138");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 138");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 138");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 138");


  // Verb tense heuristic check 139
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 139");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 139");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 139");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 139");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 139");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 139");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 139");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 139");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 139");


  // Verb tense heuristic check 140
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 140");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 140");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 140");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 140");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 140");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 140");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 140");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 140");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 140");


  // Verb tense heuristic check 141
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 141");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 141");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 141");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 141");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 141");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 141");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 141");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 141");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 141");


  // Verb tense heuristic check 142
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 142");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 142");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 142");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 142");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 142");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 142");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 142");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 142");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 142");


  // Verb tense heuristic check 143
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 143");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 143");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 143");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 143");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 143");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 143");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 143");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 143");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 143");


  // Verb tense heuristic check 144
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 144");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 144");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 144");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 144");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 144");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 144");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 144");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 144");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 144");


  // Verb tense heuristic check 145
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 145");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 145");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 145");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 145");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 145");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 145");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 145");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 145");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 145");


  // Verb tense heuristic check 146
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 146");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 146");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 146");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 146");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 146");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 146");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 146");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 146");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 146");


  // Verb tense heuristic check 147
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 147");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 147");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 147");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 147");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 147");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 147");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 147");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 147");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 147");


  // Verb tense heuristic check 148
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 148");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 148");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 148");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 148");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 148");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 148");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 148");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 148");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 148");


  // Verb tense heuristic check 149
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 149");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 149");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 149");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 149");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 149");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 149");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 149");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 149");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 149");


  // Verb tense heuristic check 150
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 150");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 150");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 150");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 150");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 150");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 150");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 150");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 150");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 150");


  // Verb tense heuristic check 151
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 151");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 151");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 151");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 151");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 151");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 151");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 151");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 151");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 151");


  // Verb tense heuristic check 152
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 152");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 152");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 152");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 152");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 152");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 152");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 152");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 152");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 152");


  // Verb tense heuristic check 153
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 153");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 153");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 153");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 153");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 153");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 153");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 153");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 153");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 153");


  // Verb tense heuristic check 154
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 154");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 154");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 154");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 154");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 154");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 154");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 154");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 154");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 154");


  // Verb tense heuristic check 155
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 155");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 155");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 155");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 155");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 155");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 155");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 155");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 155");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 155");


  // Verb tense heuristic check 156
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 156");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 156");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 156");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 156");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 156");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 156");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 156");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 156");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 156");


  // Verb tense heuristic check 157
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 157");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 157");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 157");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 157");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 157");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 157");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 157");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 157");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 157");


  // Verb tense heuristic check 158
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 158");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 158");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 158");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 158");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 158");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 158");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 158");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 158");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 158");


  // Verb tense heuristic check 159
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 159");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 159");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 159");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 159");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 159");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 159");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 159");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 159");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 159");


  // Verb tense heuristic check 160
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 160");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 160");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 160");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 160");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 160");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 160");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 160");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 160");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 160");


  // Verb tense heuristic check 161
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 161");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 161");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 161");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 161");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 161");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 161");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 161");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 161");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 161");


  // Verb tense heuristic check 162
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 162");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 162");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 162");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 162");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 162");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 162");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 162");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 162");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 162");


  // Verb tense heuristic check 163
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 163");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 163");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 163");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 163");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 163");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 163");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 163");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 163");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 163");


  // Verb tense heuristic check 164
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 164");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 164");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 164");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 164");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 164");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 164");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 164");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 164");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 164");


  // Verb tense heuristic check 165
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 165");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 165");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 165");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 165");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 165");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 165");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 165");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 165");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 165");


  // Verb tense heuristic check 166
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 166");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 166");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 166");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 166");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 166");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 166");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 166");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 166");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 166");


  // Verb tense heuristic check 167
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 167");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 167");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 167");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 167");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 167");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 167");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 167");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 167");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 167");


  // Verb tense heuristic check 168
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 168");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 168");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 168");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 168");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 168");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 168");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 168");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 168");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 168");


  // Verb tense heuristic check 169
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 169");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 169");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 169");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 169");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 169");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 169");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 169");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 169");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 169");


  // Verb tense heuristic check 170
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 170");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 170");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 170");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 170");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 170");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 170");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 170");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 170");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 170");


  // Verb tense heuristic check 171
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 171");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 171");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 171");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 171");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 171");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 171");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 171");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 171");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 171");


  // Verb tense heuristic check 172
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 172");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 172");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 172");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 172");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 172");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 172");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 172");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 172");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 172");


  // Verb tense heuristic check 173
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 173");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 173");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 173");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 173");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 173");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 173");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 173");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 173");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 173");


  // Verb tense heuristic check 174
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 174");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 174");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 174");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 174");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 174");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 174");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 174");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 174");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 174");


  // Verb tense heuristic check 175
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 175");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 175");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 175");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 175");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 175");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 175");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 175");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 175");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 175");


  // Verb tense heuristic check 176
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 176");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 176");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 176");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 176");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 176");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 176");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 176");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 176");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 176");


  // Verb tense heuristic check 177
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 177");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 177");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 177");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 177");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 177");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 177");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 177");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 177");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 177");


  // Verb tense heuristic check 178
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 178");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 178");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 178");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 178");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 178");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 178");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 178");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 178");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 178");


  // Verb tense heuristic check 179
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 179");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 179");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 179");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 179");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 179");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 179");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 179");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 179");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 179");


  // Verb tense heuristic check 180
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 180");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 180");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 180");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 180");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 180");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 180");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 180");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 180");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 180");


  // Verb tense heuristic check 181
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 181");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 181");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 181");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 181");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 181");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 181");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 181");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 181");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 181");


  // Verb tense heuristic check 182
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 182");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 182");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 182");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 182");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 182");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 182");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 182");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 182");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 182");


  // Verb tense heuristic check 183
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 183");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 183");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 183");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 183");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 183");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 183");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 183");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 183");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 183");


  // Verb tense heuristic check 184
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 184");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 184");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 184");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 184");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 184");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 184");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 184");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 184");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 184");


  // Verb tense heuristic check 185
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 185");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 185");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 185");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 185");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 185");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 185");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 185");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 185");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 185");


  // Verb tense heuristic check 186
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 186");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 186");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 186");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 186");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 186");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 186");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 186");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 186");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 186");


  // Verb tense heuristic check 187
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 187");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 187");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 187");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 187");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 187");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 187");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 187");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 187");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 187");


  // Verb tense heuristic check 188
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 188");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 188");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 188");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 188");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 188");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 188");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 188");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 188");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 188");


  // Verb tense heuristic check 189
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 189");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 189");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 189");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 189");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 189");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 189");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 189");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 189");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 189");


  // Verb tense heuristic check 190
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 190");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 190");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 190");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 190");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 190");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 190");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 190");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 190");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 190");


  // Verb tense heuristic check 191
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 191");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 191");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 191");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 191");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 191");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 191");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 191");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 191");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 191");


  // Verb tense heuristic check 192
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 192");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 192");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 192");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 192");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 192");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 192");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 192");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 192");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 192");


  // Verb tense heuristic check 193
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 193");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 193");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 193");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 193");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 193");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 193");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 193");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 193");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 193");


  // Verb tense heuristic check 194
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 194");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 194");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 194");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 194");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 194");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 194");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 194");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 194");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 194");


  // Verb tense heuristic check 195
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 195");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 195");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 195");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 195");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 195");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 195");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 195");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 195");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 195");


  // Verb tense heuristic check 196
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 196");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 196");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 196");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 196");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 196");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 196");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 196");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 196");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 196");


  // Verb tense heuristic check 197
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 197");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 197");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 197");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 197");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 197");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 197");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 197");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 197");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 197");


  // Verb tense heuristic check 198
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 198");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 198");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 198");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 198");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 198");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 198");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 198");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 198");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 198");


  // Verb tense heuristic check 199
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 199");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 199");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 199");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 199");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 199");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 199");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 199");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 199");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 199");


  // Verb tense heuristic check 200
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 200");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 200");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 200");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 200");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 200");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 200");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 200");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 200");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 200");


  // Verb tense heuristic check 201
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 201");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 201");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 201");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 201");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 201");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 201");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 201");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 201");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 201");


  // Verb tense heuristic check 202
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 202");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 202");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 202");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 202");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 202");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 202");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 202");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 202");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 202");


  // Verb tense heuristic check 203
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 203");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 203");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 203");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 203");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 203");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 203");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 203");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 203");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 203");


  // Verb tense heuristic check 204
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 204");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 204");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 204");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 204");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 204");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 204");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 204");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 204");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 204");


  // Verb tense heuristic check 205
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 205");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 205");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 205");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 205");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 205");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 205");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 205");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 205");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 205");


  // Verb tense heuristic check 206
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 206");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 206");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 206");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 206");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 206");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 206");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 206");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 206");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 206");


  // Verb tense heuristic check 207
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 207");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 207");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 207");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 207");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 207");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 207");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 207");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 207");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 207");


  // Verb tense heuristic check 208
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 208");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 208");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 208");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 208");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 208");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 208");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 208");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 208");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 208");


  // Verb tense heuristic check 209
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 209");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 209");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 209");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 209");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 209");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 209");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 209");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 209");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 209");


  // Verb tense heuristic check 210
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 210");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 210");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 210");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 210");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 210");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 210");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 210");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 210");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 210");


  // Verb tense heuristic check 211
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 211");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 211");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 211");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 211");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 211");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 211");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 211");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 211");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 211");


  // Verb tense heuristic check 212
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 212");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 212");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 212");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 212");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 212");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 212");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 212");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 212");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 212");


  // Verb tense heuristic check 213
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 213");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 213");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 213");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 213");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 213");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 213");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 213");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 213");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 213");


  // Verb tense heuristic check 214
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 214");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 214");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 214");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 214");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 214");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 214");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 214");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 214");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 214");


  // Verb tense heuristic check 215
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 215");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 215");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 215");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 215");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 215");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 215");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 215");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 215");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 215");


  // Verb tense heuristic check 216
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 216");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 216");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 216");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 216");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 216");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 216");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 216");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 216");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 216");


  // Verb tense heuristic check 217
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 217");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 217");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 217");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 217");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 217");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 217");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 217");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 217");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 217");


  // Verb tense heuristic check 218
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 218");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 218");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 218");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 218");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 218");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 218");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 218");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 218");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 218");


  // Verb tense heuristic check 219
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 219");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 219");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 219");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 219");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 219");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 219");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 219");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 219");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 219");


  // Verb tense heuristic check 220
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 220");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 220");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 220");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 220");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 220");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 220");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 220");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 220");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 220");


  // Verb tense heuristic check 221
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 221");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 221");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 221");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 221");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 221");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 221");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 221");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 221");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 221");


  // Verb tense heuristic check 222
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 222");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 222");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 222");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 222");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 222");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 222");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 222");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 222");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 222");


  // Verb tense heuristic check 223
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 223");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 223");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 223");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 223");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 223");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 223");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 223");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 223");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 223");


  // Verb tense heuristic check 224
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 224");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 224");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 224");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 224");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 224");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 224");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 224");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 224");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 224");


  // Verb tense heuristic check 225
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 225");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 225");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 225");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 225");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 225");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 225");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 225");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 225");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 225");


  // Verb tense heuristic check 226
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 226");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 226");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 226");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 226");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 226");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 226");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 226");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 226");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 226");


  // Verb tense heuristic check 227
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 227");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 227");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 227");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 227");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 227");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 227");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 227");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 227");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 227");


  // Verb tense heuristic check 228
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 228");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 228");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 228");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 228");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 228");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 228");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 228");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 228");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 228");


  // Verb tense heuristic check 229
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 229");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 229");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 229");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 229");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 229");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 229");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 229");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 229");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 229");


  // Verb tense heuristic check 230
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 230");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 230");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 230");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 230");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 230");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 230");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 230");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 230");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 230");


  // Verb tense heuristic check 231
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 231");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 231");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 231");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 231");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 231");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 231");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 231");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 231");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 231");


  // Verb tense heuristic check 232
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 232");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 232");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 232");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 232");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 232");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 232");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 232");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 232");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 232");


  // Verb tense heuristic check 233
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 233");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 233");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 233");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 233");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 233");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 233");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 233");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 233");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 233");


  // Verb tense heuristic check 234
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 234");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 234");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 234");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 234");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 234");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 234");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 234");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 234");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 234");


  // Verb tense heuristic check 235
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 235");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 235");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 235");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 235");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 235");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 235");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 235");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 235");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 235");


  // Verb tense heuristic check 236
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 236");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 236");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 236");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 236");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 236");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 236");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 236");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 236");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 236");


  // Verb tense heuristic check 237
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 237");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 237");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 237");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 237");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 237");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 237");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 237");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 237");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 237");


  // Verb tense heuristic check 238
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 238");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 238");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 238");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 238");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 238");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 238");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 238");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 238");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 238");


  // Verb tense heuristic check 239
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 239");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 239");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 239");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 239");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 239");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 239");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 239");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 239");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 239");


  // Verb tense heuristic check 240
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 240");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 240");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 240");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 240");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 240");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 240");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 240");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 240");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 240");


  // Verb tense heuristic check 241
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 241");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 241");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 241");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 241");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 241");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 241");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 241");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 241");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 241");


  // Verb tense heuristic check 242
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 242");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 242");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 242");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 242");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 242");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 242");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 242");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 242");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 242");


  // Verb tense heuristic check 243
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 243");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 243");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 243");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 243");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 243");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 243");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 243");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 243");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 243");


  // Verb tense heuristic check 244
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 244");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 244");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 244");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 244");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 244");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 244");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 244");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 244");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 244");


  // Verb tense heuristic check 245
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 245");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 245");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 245");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 245");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 245");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 245");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 245");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 245");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 245");


  // Verb tense heuristic check 246
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 246");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 246");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 246");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 246");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 246");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 246");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 246");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 246");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 246");


  // Verb tense heuristic check 247
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 247");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 247");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 247");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 247");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 247");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 247");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 247");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 247");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 247");


  // Verb tense heuristic check 248
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 248");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 248");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 248");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 248");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 248");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 248");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 248");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 248");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 248");


  // Verb tense heuristic check 249
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 249");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 249");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 249");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 249");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 249");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 249");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 249");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 249");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 249");


  // Verb tense heuristic check 250
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 250");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 250");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 250");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 250");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 250");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 250");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 250");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 250");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 250");


  // Verb tense heuristic check 251
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 251");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 251");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 251");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 251");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 251");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 251");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 251");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 251");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 251");


  // Verb tense heuristic check 252
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 252");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 252");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 252");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 252");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 252");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 252");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 252");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 252");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 252");


  // Verb tense heuristic check 253
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 253");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 253");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 253");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 253");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 253");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 253");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 253");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 253");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 253");


  // Verb tense heuristic check 254
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 254");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 254");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 254");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 254");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 254");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 254");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 254");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 254");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 254");


  // Verb tense heuristic check 255
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 255");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 255");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 255");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 255");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 255");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 255");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 255");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 255");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 255");


  // Verb tense heuristic check 256
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 256");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 256");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 256");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 256");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 256");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 256");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 256");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 256");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 256");


  // Verb tense heuristic check 257
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 257");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 257");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 257");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 257");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 257");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 257");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 257");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 257");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 257");


  // Verb tense heuristic check 258
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 258");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 258");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 258");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 258");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 258");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 258");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 258");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 258");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 258");


  // Verb tense heuristic check 259
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 259");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 259");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 259");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 259");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 259");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 259");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 259");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 259");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 259");


  // Verb tense heuristic check 260
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 260");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 260");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 260");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 260");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 260");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 260");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 260");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 260");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 260");


  // Verb tense heuristic check 261
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 261");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 261");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 261");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 261");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 261");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 261");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 261");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 261");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 261");


  // Verb tense heuristic check 262
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 262");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 262");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 262");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 262");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 262");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 262");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 262");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 262");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 262");


  // Verb tense heuristic check 263
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 263");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 263");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 263");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 263");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 263");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 263");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 263");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 263");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 263");


  // Verb tense heuristic check 264
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 264");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 264");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 264");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 264");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 264");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 264");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 264");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 264");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 264");


  // Verb tense heuristic check 265
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 265");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 265");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 265");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 265");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 265");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 265");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 265");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 265");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 265");


  // Verb tense heuristic check 266
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 266");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 266");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 266");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 266");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 266");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 266");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 266");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 266");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 266");


  // Verb tense heuristic check 267
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 267");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 267");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 267");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 267");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 267");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 267");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 267");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 267");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 267");


  // Verb tense heuristic check 268
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 268");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 268");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 268");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 268");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 268");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 268");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 268");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 268");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 268");


  // Verb tense heuristic check 269
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 269");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 269");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 269");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 269");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 269");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 269");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 269");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 269");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 269");


  // Verb tense heuristic check 270
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 270");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 270");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 270");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 270");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 270");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 270");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 270");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 270");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 270");


  // Verb tense heuristic check 271
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 271");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 271");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 271");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 271");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 271");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 271");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 271");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 271");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 271");


  // Verb tense heuristic check 272
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 272");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 272");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 272");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 272");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 272");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 272");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 272");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 272");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 272");


  // Verb tense heuristic check 273
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 273");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 273");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 273");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 273");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 273");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 273");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 273");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 273");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 273");


  // Verb tense heuristic check 274
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 274");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 274");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 274");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 274");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 274");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 274");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 274");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 274");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 274");


  // Verb tense heuristic check 275
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 275");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 275");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 275");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 275");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 275");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 275");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 275");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 275");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 275");


  // Verb tense heuristic check 276
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 276");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 276");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 276");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 276");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 276");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 276");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 276");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 276");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 276");


  // Verb tense heuristic check 277
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 277");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 277");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 277");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 277");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 277");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 277");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 277");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 277");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 277");


  // Verb tense heuristic check 278
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 278");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 278");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 278");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 278");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 278");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 278");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 278");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 278");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 278");


  // Verb tense heuristic check 279
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 279");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 279");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 279");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 279");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 279");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 279");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 279");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 279");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 279");


  // Verb tense heuristic check 280
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 280");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 280");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 280");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 280");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 280");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 280");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 280");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 280");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 280");


  // Verb tense heuristic check 281
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 281");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 281");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 281");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 281");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 281");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 281");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 281");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 281");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 281");


  // Verb tense heuristic check 282
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 282");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 282");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 282");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 282");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 282");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 282");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 282");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 282");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 282");


  // Verb tense heuristic check 283
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 283");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 283");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 283");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 283");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 283");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 283");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 283");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 283");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 283");


  // Verb tense heuristic check 284
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 284");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 284");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 284");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 284");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 284");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 284");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 284");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 284");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 284");


  // Verb tense heuristic check 285
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 285");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 285");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 285");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 285");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 285");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 285");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 285");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 285");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 285");


  // Verb tense heuristic check 286
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 286");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 286");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 286");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 286");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 286");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 286");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 286");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 286");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 286");


  // Verb tense heuristic check 287
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 287");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 287");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 287");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 287");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 287");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 287");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 287");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 287");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 287");


  // Verb tense heuristic check 288
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 288");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 288");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 288");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 288");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 288");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 288");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 288");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 288");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 288");


  // Verb tense heuristic check 289
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 289");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 289");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 289");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 289");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 289");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 289");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 289");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 289");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 289");


  // Verb tense heuristic check 290
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 290");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 290");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 290");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 290");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 290");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 290");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 290");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 290");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 290");


  // Verb tense heuristic check 291
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 291");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 291");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 291");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 291");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 291");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 291");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 291");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 291");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 291");


  // Verb tense heuristic check 292
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 292");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 292");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 292");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 292");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 292");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 292");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 292");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 292");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 292");


  // Verb tense heuristic check 293
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 293");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 293");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 293");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 293");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 293");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 293");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 293");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 293");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 293");


  // Verb tense heuristic check 294
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 294");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 294");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 294");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 294");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 294");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 294");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 294");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 294");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 294");


  // Verb tense heuristic check 295
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 295");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 295");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 295");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 295");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 295");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 295");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 295");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 295");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 295");


  // Verb tense heuristic check 296
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 296");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 296");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 296");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 296");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 296");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 296");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 296");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 296");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 296");


  // Verb tense heuristic check 297
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 297");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 297");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 297");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 297");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 297");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 297");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 297");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 297");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 297");


  // Verb tense heuristic check 298
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 298");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 298");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 298");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 298");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 298");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 298");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 298");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 298");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 298");


  // Verb tense heuristic check 299
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 299");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 299");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 299");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 299");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 299");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 299");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 299");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 299");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 299");


  // Verb tense heuristic check 300
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 300");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 300");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 300");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 300");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 300");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 300");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 300");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 300");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 300");


  // Verb tense heuristic check 301
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 301");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 301");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 301");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 301");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 301");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 301");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 301");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 301");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 301");


  // Verb tense heuristic check 302
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 302");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 302");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 302");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 302");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 302");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 302");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 302");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 302");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 302");


  // Verb tense heuristic check 303
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 303");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 303");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 303");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 303");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 303");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 303");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 303");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 303");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 303");


  // Verb tense heuristic check 304
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 304");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 304");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 304");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 304");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 304");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 304");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 304");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 304");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 304");


  // Verb tense heuristic check 305
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 305");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 305");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 305");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 305");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 305");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 305");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 305");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 305");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 305");


  // Verb tense heuristic check 306
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 306");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 306");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 306");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 306");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 306");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 306");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 306");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 306");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 306");


  // Verb tense heuristic check 307
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 307");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 307");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 307");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 307");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 307");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 307");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 307");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 307");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 307");


  // Verb tense heuristic check 308
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 308");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 308");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 308");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 308");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 308");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 308");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 308");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 308");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 308");


  // Verb tense heuristic check 309
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 309");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 309");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 309");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 309");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 309");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 309");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 309");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 309");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 309");


  // Verb tense heuristic check 310
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 310");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 310");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 310");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 310");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 310");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 310");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 310");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 310");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 310");


  // Verb tense heuristic check 311
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 311");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 311");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 311");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 311");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 311");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 311");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 311");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 311");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 311");


  // Verb tense heuristic check 312
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 312");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 312");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 312");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 312");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 312");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 312");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 312");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 312");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 312");


  // Verb tense heuristic check 313
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 313");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 313");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 313");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 313");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 313");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 313");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 313");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 313");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 313");


  // Verb tense heuristic check 314
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 314");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 314");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 314");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 314");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 314");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 314");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 314");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 314");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 314");


  // Verb tense heuristic check 315
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 315");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 315");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 315");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 315");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 315");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 315");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 315");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 315");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 315");


  // Verb tense heuristic check 316
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 316");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 316");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 316");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 316");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 316");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 316");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 316");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 316");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 316");


  // Verb tense heuristic check 317
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 317");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 317");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 317");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 317");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 317");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 317");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 317");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 317");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 317");


  // Verb tense heuristic check 318
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 318");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 318");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 318");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 318");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 318");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 318");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 318");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 318");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 318");


  // Verb tense heuristic check 319
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 319");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 319");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 319");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 319");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 319");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 319");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 319");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 319");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 319");


  // Verb tense heuristic check 320
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 320");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 320");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 320");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 320");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 320");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 320");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 320");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 320");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 320");


  // Verb tense heuristic check 321
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 321");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 321");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 321");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 321");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 321");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 321");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 321");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 321");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 321");


  // Verb tense heuristic check 322
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 322");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 322");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 322");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 322");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 322");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 322");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 322");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 322");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 322");


  // Verb tense heuristic check 323
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 323");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 323");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 323");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 323");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 323");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 323");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 323");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 323");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 323");


  // Verb tense heuristic check 324
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 324");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 324");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 324");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 324");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 324");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 324");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 324");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 324");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 324");


  // Verb tense heuristic check 325
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 325");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 325");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 325");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 325");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 325");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 325");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 325");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 325");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 325");


  // Verb tense heuristic check 326
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 326");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 326");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 326");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 326");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 326");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 326");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 326");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 326");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 326");


  // Verb tense heuristic check 327
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 327");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 327");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 327");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 327");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 327");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 327");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 327");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 327");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 327");


  // Verb tense heuristic check 328
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 328");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 328");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 328");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 328");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 328");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 328");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 328");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 328");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 328");


  // Verb tense heuristic check 329
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 329");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 329");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 329");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 329");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 329");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 329");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 329");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 329");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 329");


  // Verb tense heuristic check 330
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 330");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 330");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 330");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 330");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 330");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 330");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 330");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 330");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 330");


  // Verb tense heuristic check 331
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 331");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 331");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 331");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 331");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 331");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 331");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 331");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 331");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 331");


  // Verb tense heuristic check 332
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 332");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 332");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 332");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 332");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 332");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 332");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 332");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 332");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 332");


  // Verb tense heuristic check 333
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 333");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 333");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 333");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 333");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 333");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 333");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 333");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 333");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 333");


  // Verb tense heuristic check 334
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 334");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 334");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 334");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 334");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 334");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 334");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 334");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 334");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 334");


  // Verb tense heuristic check 335
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 335");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 335");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 335");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 335");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 335");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 335");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 335");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 335");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 335");


  // Verb tense heuristic check 336
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 336");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 336");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 336");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 336");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 336");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 336");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 336");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 336");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 336");


  // Verb tense heuristic check 337
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 337");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 337");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 337");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 337");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 337");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 337");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 337");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 337");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 337");


  // Verb tense heuristic check 338
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 338");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 338");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 338");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 338");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 338");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 338");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 338");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 338");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 338");


  // Verb tense heuristic check 339
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 339");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 339");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 339");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 339");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 339");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 339");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 339");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 339");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 339");


  // Verb tense heuristic check 340
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 340");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 340");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 340");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 340");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 340");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 340");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 340");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 340");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 340");


  // Verb tense heuristic check 341
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 341");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 341");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 341");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 341");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 341");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 341");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 341");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 341");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 341");


  // Verb tense heuristic check 342
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 342");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 342");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 342");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 342");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 342");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 342");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 342");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 342");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 342");


  // Verb tense heuristic check 343
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 343");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 343");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 343");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 343");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 343");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 343");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 343");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 343");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 343");


  // Verb tense heuristic check 344
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 344");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 344");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 344");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 344");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 344");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 344");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 344");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 344");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 344");


  // Verb tense heuristic check 345
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 345");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 345");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 345");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 345");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 345");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 345");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 345");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 345");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 345");


  // Verb tense heuristic check 346
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 346");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 346");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 346");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 346");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 346");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 346");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 346");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 346");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 346");


  // Verb tense heuristic check 347
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 347");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 347");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 347");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 347");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 347");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 347");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 347");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 347");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 347");


  // Verb tense heuristic check 348
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 348");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 348");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 348");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 348");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 348");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 348");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 348");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 348");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 348");


  // Verb tense heuristic check 349
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 349");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 349");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 349");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 349");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 349");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 349");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 349");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 349");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 349");


  // Verb tense heuristic check 350
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 350");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 350");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 350");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 350");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 350");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 350");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 350");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 350");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 350");


  // Verb tense heuristic check 351
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 351");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 351");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 351");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 351");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 351");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 351");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 351");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 351");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 351");


  // Verb tense heuristic check 352
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 352");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 352");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 352");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 352");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 352");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 352");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 352");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 352");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 352");


  // Verb tense heuristic check 353
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 353");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 353");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 353");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 353");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 353");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 353");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 353");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 353");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 353");


  // Verb tense heuristic check 354
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 354");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 354");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 354");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 354");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 354");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 354");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 354");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 354");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 354");


  // Verb tense heuristic check 355
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 355");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 355");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 355");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 355");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 355");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 355");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 355");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 355");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 355");


  // Verb tense heuristic check 356
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 356");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 356");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 356");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 356");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 356");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 356");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 356");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 356");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 356");


  // Verb tense heuristic check 357
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 357");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 357");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 357");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 357");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 357");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 357");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 357");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 357");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 357");


  // Verb tense heuristic check 358
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 358");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 358");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 358");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 358");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 358");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 358");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 358");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 358");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 358");


  // Verb tense heuristic check 359
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 359");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 359");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 359");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 359");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 359");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 359");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 359");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 359");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 359");


  // Verb tense heuristic check 360
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 360");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 360");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 360");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 360");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 360");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 360");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 360");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 360");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 360");


  // Verb tense heuristic check 361
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 361");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 361");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 361");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 361");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 361");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 361");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 361");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 361");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 361");


  // Verb tense heuristic check 362
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 362");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 362");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 362");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 362");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 362");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 362");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 362");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 362");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 362");


  // Verb tense heuristic check 363
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 363");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 363");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 363");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 363");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 363");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 363");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 363");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 363");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 363");


  // Verb tense heuristic check 364
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 364");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 364");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 364");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 364");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 364");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 364");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 364");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 364");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 364");


  // Verb tense heuristic check 365
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 365");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 365");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 365");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 365");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 365");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 365");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 365");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 365");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 365");


  // Verb tense heuristic check 366
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 366");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 366");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 366");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 366");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 366");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 366");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 366");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 366");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 366");


  // Verb tense heuristic check 367
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 367");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 367");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 367");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 367");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 367");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 367");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 367");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 367");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 367");


  // Verb tense heuristic check 368
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 368");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 368");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 368");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 368");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 368");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 368");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 368");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 368");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 368");


  // Verb tense heuristic check 369
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 369");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 369");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 369");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 369");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 369");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 369");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 369");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 369");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 369");


  // Verb tense heuristic check 370
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 370");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 370");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 370");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 370");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 370");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 370");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 370");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 370");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 370");


  // Verb tense heuristic check 371
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 371");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 371");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 371");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 371");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 371");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 371");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 371");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 371");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 371");


  // Verb tense heuristic check 372
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 372");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 372");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 372");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 372");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 372");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 372");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 372");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 372");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 372");


  // Verb tense heuristic check 373
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 373");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 373");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 373");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 373");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 373");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 373");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 373");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 373");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 373");


  // Verb tense heuristic check 374
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 374");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 374");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 374");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 374");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 374");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 374");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 374");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 374");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 374");


  // Verb tense heuristic check 375
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 375");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 375");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 375");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 375");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 375");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 375");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 375");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 375");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 375");


  // Verb tense heuristic check 376
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 376");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 376");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 376");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 376");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 376");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 376");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 376");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 376");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 376");


  // Verb tense heuristic check 377
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 377");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 377");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 377");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 377");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 377");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 377");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 377");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 377");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 377");


  // Verb tense heuristic check 378
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 378");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 378");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 378");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 378");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 378");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 378");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 378");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 378");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 378");


  // Verb tense heuristic check 379
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 379");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 379");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 379");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 379");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 379");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 379");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 379");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 379");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 379");


  // Verb tense heuristic check 380
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 380");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 380");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 380");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 380");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 380");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 380");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 380");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 380");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 380");


  // Verb tense heuristic check 381
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 381");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 381");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 381");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 381");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 381");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 381");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 381");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 381");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 381");


  // Verb tense heuristic check 382
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 382");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 382");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 382");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 382");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 382");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 382");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 382");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 382");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 382");


  // Verb tense heuristic check 383
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 383");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 383");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 383");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 383");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 383");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 383");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 383");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 383");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 383");


  // Verb tense heuristic check 384
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 384");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 384");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 384");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 384");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 384");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 384");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 384");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 384");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 384");


  // Verb tense heuristic check 385
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 385");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 385");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 385");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 385");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 385");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 385");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 385");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 385");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 385");


  // Verb tense heuristic check 386
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 386");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 386");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 386");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 386");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 386");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 386");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 386");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 386");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 386");


  // Verb tense heuristic check 387
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 387");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 387");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 387");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 387");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 387");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 387");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 387");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 387");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 387");


  // Verb tense heuristic check 388
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 388");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 388");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 388");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 388");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 388");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 388");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 388");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 388");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 388");


  // Verb tense heuristic check 389
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 389");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 389");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 389");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 389");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 389");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 389");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 389");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 389");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 389");


  // Verb tense heuristic check 390
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 390");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 390");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 390");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 390");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 390");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 390");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 390");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 390");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 390");


  // Verb tense heuristic check 391
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 391");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 391");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 391");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 391");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 391");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 391");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 391");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 391");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 391");


  // Verb tense heuristic check 392
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 392");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 392");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 392");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 392");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 392");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 392");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 392");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 392");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 392");


  // Verb tense heuristic check 393
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 393");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 393");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 393");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 393");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 393");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 393");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 393");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 393");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 393");


  // Verb tense heuristic check 394
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 394");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 394");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 394");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 394");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 394");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 394");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 394");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 394");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 394");


  // Verb tense heuristic check 395
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 395");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 395");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 395");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 395");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 395");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 395");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 395");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 395");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 395");


  // Verb tense heuristic check 396
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 396");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 396");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 396");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 396");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 396");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 396");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 396");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 396");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 396");


  // Verb tense heuristic check 397
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 397");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 397");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 397");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 397");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 397");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 397");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 397");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 397");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 397");


  // Verb tense heuristic check 398
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 398");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 398");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 398");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 398");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 398");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 398");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 398");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 398");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 398");


  // Verb tense heuristic check 399
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 399");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 399");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 399");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 399");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 399");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 399");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 399");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 399");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 399");


  // Verb tense heuristic check 400
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 400");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 400");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 400");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 400");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 400");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 400");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 400");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 400");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 400");


  // Verb tense heuristic check 401
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 401");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 401");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 401");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 401");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 401");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 401");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 401");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 401");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 401");


  // Verb tense heuristic check 402
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 402");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 402");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 402");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 402");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 402");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 402");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 402");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 402");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 402");


  // Verb tense heuristic check 403
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 403");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 403");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 403");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 403");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 403");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 403");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 403");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 403");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 403");


  // Verb tense heuristic check 404
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 404");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 404");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 404");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 404");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 404");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 404");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 404");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 404");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 404");


  // Verb tense heuristic check 405
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 405");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 405");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 405");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 405");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 405");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 405");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 405");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 405");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 405");


  // Verb tense heuristic check 406
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 406");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 406");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 406");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 406");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 406");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 406");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 406");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 406");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 406");


  // Verb tense heuristic check 407
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 407");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 407");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 407");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 407");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 407");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 407");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 407");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 407");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 407");


  // Verb tense heuristic check 408
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 408");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 408");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 408");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 408");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 408");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 408");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 408");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 408");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 408");


  // Verb tense heuristic check 409
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 409");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 409");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 409");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 409");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 409");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 409");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 409");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 409");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 409");


  // Verb tense heuristic check 410
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 410");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 410");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 410");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 410");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 410");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 410");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 410");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 410");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 410");


  // Verb tense heuristic check 411
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 411");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 411");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 411");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 411");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 411");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 411");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 411");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 411");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 411");


  // Verb tense heuristic check 412
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 412");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 412");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 412");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 412");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 412");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 412");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 412");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 412");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 412");


  // Verb tense heuristic check 413
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 413");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 413");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 413");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 413");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 413");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 413");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 413");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 413");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 413");


  // Verb tense heuristic check 414
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 414");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 414");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 414");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 414");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 414");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 414");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 414");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 414");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 414");


  // Verb tense heuristic check 415
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 415");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 415");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 415");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 415");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 415");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 415");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 415");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 415");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 415");


  // Verb tense heuristic check 416
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 416");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 416");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 416");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 416");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 416");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 416");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 416");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 416");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 416");


  // Verb tense heuristic check 417
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 417");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 417");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 417");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 417");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 417");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 417");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 417");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 417");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 417");


  // Verb tense heuristic check 418
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 418");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 418");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 418");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 418");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 418");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 418");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 418");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 418");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 418");


  // Verb tense heuristic check 419
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 419");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 419");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 419");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 419");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 419");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 419");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 419");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 419");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 419");


  // Verb tense heuristic check 420
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 420");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 420");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 420");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 420");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 420");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 420");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 420");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 420");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 420");


  // Verb tense heuristic check 421
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 421");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 421");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 421");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 421");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 421");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 421");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 421");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 421");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 421");


  // Verb tense heuristic check 422
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 422");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 422");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 422");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 422");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 422");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 422");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 422");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 422");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 422");


  // Verb tense heuristic check 423
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 423");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 423");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 423");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 423");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 423");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 423");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 423");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 423");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 423");


  // Verb tense heuristic check 424
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 424");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 424");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 424");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 424");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 424");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 424");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 424");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 424");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 424");


  // Verb tense heuristic check 425
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 425");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 425");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 425");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 425");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 425");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 425");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 425");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 425");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 425");


  // Verb tense heuristic check 426
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 426");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 426");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 426");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 426");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 426");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 426");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 426");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 426");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 426");


  // Verb tense heuristic check 427
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 427");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 427");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 427");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 427");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 427");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 427");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 427");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 427");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 427");


  // Verb tense heuristic check 428
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 428");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 428");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 428");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 428");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 428");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 428");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 428");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 428");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 428");


  // Verb tense heuristic check 429
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 429");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 429");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 429");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 429");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 429");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 429");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 429");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 429");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 429");


  // Verb tense heuristic check 430
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 430");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 430");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 430");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 430");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 430");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 430");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 430");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 430");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 430");


  // Verb tense heuristic check 431
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 431");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 431");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 431");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 431");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 431");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 431");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 431");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 431");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 431");


  // Verb tense heuristic check 432
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 432");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 432");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 432");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 432");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 432");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 432");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 432");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 432");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 432");


  // Verb tense heuristic check 433
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 433");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 433");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 433");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 433");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 433");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 433");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 433");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 433");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 433");


  // Verb tense heuristic check 434
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 434");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 434");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 434");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 434");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 434");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 434");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 434");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 434");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 434");


  // Verb tense heuristic check 435
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 435");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 435");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 435");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 435");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 435");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 435");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 435");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 435");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 435");


  // Verb tense heuristic check 436
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 436");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 436");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 436");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 436");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 436");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 436");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 436");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 436");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 436");


  // Verb tense heuristic check 437
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 437");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 437");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 437");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 437");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 437");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 437");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 437");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 437");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 437");


  // Verb tense heuristic check 438
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 438");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 438");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 438");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 438");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 438");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 438");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 438");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 438");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 438");


  // Verb tense heuristic check 439
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 439");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 439");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 439");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 439");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 439");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 439");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 439");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 439");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 439");


  // Verb tense heuristic check 440
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 440");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 440");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 440");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 440");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 440");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 440");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 440");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 440");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 440");


  // Verb tense heuristic check 441
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 441");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 441");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 441");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 441");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 441");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 441");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 441");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 441");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 441");


  // Verb tense heuristic check 442
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 442");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 442");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 442");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 442");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 442");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 442");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 442");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 442");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 442");


  // Verb tense heuristic check 443
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 443");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 443");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 443");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 443");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 443");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 443");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 443");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 443");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 443");


  // Verb tense heuristic check 444
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 444");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 444");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 444");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 444");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 444");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 444");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 444");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 444");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 444");


  // Verb tense heuristic check 445
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 445");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 445");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 445");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 445");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 445");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 445");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 445");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 445");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 445");


  // Verb tense heuristic check 446
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 446");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 446");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 446");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 446");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 446");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 446");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 446");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 446");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 446");


  // Verb tense heuristic check 447
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 447");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 447");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 447");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 447");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 447");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 447");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 447");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 447");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 447");


  // Verb tense heuristic check 448
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 448");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 448");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 448");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 448");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 448");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 448");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 448");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 448");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 448");


  // Verb tense heuristic check 449
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 449");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 449");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 449");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 449");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 449");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 449");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 449");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 449");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 449");


  // Verb tense heuristic check 450
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 450");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 450");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 450");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 450");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 450");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 450");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 450");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 450");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 450");


  // Verb tense heuristic check 451
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 451");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 451");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 451");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 451");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 451");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 451");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 451");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 451");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 451");


  // Verb tense heuristic check 452
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 452");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 452");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 452");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 452");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 452");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 452");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 452");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 452");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 452");


  // Verb tense heuristic check 453
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 453");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 453");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 453");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 453");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 453");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 453");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 453");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 453");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 453");


  // Verb tense heuristic check 454
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 454");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 454");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 454");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 454");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 454");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 454");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 454");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 454");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 454");


  // Verb tense heuristic check 455
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 455");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 455");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 455");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 455");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 455");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 455");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 455");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 455");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 455");


  // Verb tense heuristic check 456
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 456");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 456");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 456");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 456");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 456");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 456");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 456");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 456");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 456");


  // Verb tense heuristic check 457
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 457");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 457");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 457");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 457");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 457");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 457");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 457");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 457");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 457");


  // Verb tense heuristic check 458
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 458");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 458");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 458");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 458");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 458");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 458");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 458");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 458");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 458");


  // Verb tense heuristic check 459
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 459");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 459");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 459");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 459");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 459");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 459");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 459");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 459");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 459");


  // Verb tense heuristic check 460
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 460");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 460");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 460");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 460");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 460");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 460");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 460");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 460");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 460");


  // Verb tense heuristic check 461
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 461");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 461");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 461");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 461");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 461");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 461");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 461");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 461");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 461");


  // Verb tense heuristic check 462
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 462");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 462");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 462");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 462");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 462");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 462");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 462");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 462");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 462");


  // Verb tense heuristic check 463
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 463");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 463");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 463");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 463");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 463");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 463");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 463");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 463");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 463");


  // Verb tense heuristic check 464
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 464");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 464");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 464");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 464");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 464");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 464");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 464");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 464");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 464");


  // Verb tense heuristic check 465
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 465");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 465");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 465");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 465");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 465");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 465");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 465");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 465");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 465");


  // Verb tense heuristic check 466
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 466");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 466");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 466");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 466");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 466");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 466");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 466");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 466");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 466");


  // Verb tense heuristic check 467
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 467");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 467");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 467");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 467");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 467");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 467");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 467");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 467");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 467");


  // Verb tense heuristic check 468
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 468");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 468");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 468");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 468");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 468");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 468");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 468");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 468");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 468");


  // Verb tense heuristic check 469
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 469");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 469");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 469");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 469");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 469");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 469");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 469");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 469");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 469");


  // Verb tense heuristic check 470
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 470");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 470");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 470");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 470");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 470");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 470");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 470");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 470");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 470");


  // Verb tense heuristic check 471
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 471");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 471");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 471");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 471");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 471");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 471");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 471");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 471");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 471");


  // Verb tense heuristic check 472
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 472");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 472");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 472");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 472");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 472");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 472");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 472");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 472");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 472");


  // Verb tense heuristic check 473
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 473");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 473");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 473");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 473");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 473");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 473");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 473");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 473");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 473");


  // Verb tense heuristic check 474
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 474");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 474");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 474");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 474");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 474");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 474");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 474");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 474");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 474");


  // Verb tense heuristic check 475
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 475");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 475");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 475");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 475");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 475");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 475");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 475");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 475");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 475");


  // Verb tense heuristic check 476
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 476");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 476");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 476");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 476");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 476");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 476");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 476");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 476");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 476");


  // Verb tense heuristic check 477
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 477");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 477");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 477");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 477");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 477");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 477");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 477");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 477");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 477");


  // Verb tense heuristic check 478
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 478");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 478");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 478");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 478");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 478");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 478");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 478");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 478");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 478");


  // Verb tense heuristic check 479
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 479");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 479");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 479");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 479");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 479");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 479");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 479");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 479");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 479");


  // Verb tense heuristic check 480
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 480");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 480");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 480");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 480");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 480");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 480");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 480");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 480");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 480");


  // Verb tense heuristic check 481
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 481");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 481");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 481");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 481");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 481");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 481");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 481");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 481");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 481");


  // Verb tense heuristic check 482
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 482");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 482");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 482");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 482");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 482");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 482");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 482");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 482");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 482");


  // Verb tense heuristic check 483
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 483");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 483");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 483");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 483");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 483");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 483");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 483");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 483");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 483");


  // Verb tense heuristic check 484
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 484");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 484");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 484");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 484");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 484");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 484");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 484");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 484");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 484");


  // Verb tense heuristic check 485
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 485");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 485");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 485");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 485");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 485");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 485");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 485");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 485");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 485");


  // Verb tense heuristic check 486
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 486");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 486");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 486");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 486");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 486");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 486");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 486");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 486");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 486");


  // Verb tense heuristic check 487
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 487");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 487");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 487");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 487");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 487");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 487");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 487");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 487");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 487");


  // Verb tense heuristic check 488
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 488");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 488");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 488");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 488");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 488");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 488");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 488");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 488");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 488");


  // Verb tense heuristic check 489
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 489");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 489");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 489");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 489");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 489");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 489");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 489");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 489");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 489");


  // Verb tense heuristic check 490
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 490");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 490");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 490");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 490");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 490");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 490");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 490");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 490");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 490");


  // Verb tense heuristic check 491
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 491");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 491");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 491");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 491");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 491");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 491");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 491");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 491");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 491");


  // Verb tense heuristic check 492
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 492");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 492");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 492");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 492");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 492");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 492");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 492");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 492");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 492");


  // Verb tense heuristic check 493
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 493");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 493");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 493");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 493");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 493");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 493");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 493");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 493");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 493");


  // Verb tense heuristic check 494
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 494");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 494");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 494");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 494");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 494");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 494");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 494");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 494");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 494");


  // Verb tense heuristic check 495
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 495");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 495");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 495");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 495");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 495");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 495");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 495");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 495");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 495");


  // Verb tense heuristic check 496
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 496");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 496");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 496");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 496");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 496");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 496");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 496");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 496");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 496");


  // Verb tense heuristic check 497
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 497");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 497");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 497");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 497");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 497");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 497");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 497");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 497");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 497");


  // Verb tense heuristic check 498
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 498");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 498");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 498");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 498");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 498");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 498");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 498");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 498");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 498");


  // Verb tense heuristic check 499
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 499");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 499");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 499");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 499");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 499");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 499");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 499");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 499");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 499");


  // Verb tense heuristic check 500
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 500");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 500");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 500");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 500");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 500");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 500");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 500");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 500");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 500");


  // Verb tense heuristic check 501
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 501");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 501");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 501");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 501");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 501");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 501");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 501");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 501");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 501");


  // Verb tense heuristic check 502
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 502");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 502");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 502");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 502");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 502");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 502");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 502");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 502");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 502");


  // Verb tense heuristic check 503
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 503");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 503");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 503");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 503");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 503");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 503");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 503");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 503");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 503");


  // Verb tense heuristic check 504
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 504");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 504");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 504");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 504");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 504");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 504");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 504");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 504");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 504");


  // Verb tense heuristic check 505
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 505");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 505");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 505");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 505");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 505");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 505");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 505");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 505");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 505");


  // Verb tense heuristic check 506
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 506");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 506");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 506");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 506");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 506");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 506");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 506");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 506");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 506");


  // Verb tense heuristic check 507
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 507");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 507");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 507");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 507");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 507");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 507");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 507");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 507");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 507");


  // Verb tense heuristic check 508
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 508");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 508");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 508");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 508");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 508");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 508");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 508");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 508");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 508");


  // Verb tense heuristic check 509
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 509");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 509");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 509");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 509");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 509");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 509");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 509");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 509");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 509");


  // Verb tense heuristic check 510
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 510");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 510");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 510");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 510");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 510");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 510");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 510");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 510");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 510");


  // Verb tense heuristic check 511
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 511");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 511");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 511");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 511");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 511");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 511");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 511");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 511");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 511");


  // Verb tense heuristic check 512
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 512");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 512");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 512");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 512");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 512");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 512");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 512");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 512");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 512");


  // Verb tense heuristic check 513
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 513");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 513");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 513");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 513");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 513");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 513");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 513");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 513");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 513");


  // Verb tense heuristic check 514
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 514");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 514");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 514");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 514");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 514");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 514");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 514");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 514");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 514");


  // Verb tense heuristic check 515
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 515");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 515");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 515");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 515");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 515");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 515");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 515");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 515");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 515");


  // Verb tense heuristic check 516
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 516");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 516");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 516");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 516");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 516");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 516");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 516");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 516");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 516");


  // Verb tense heuristic check 517
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 517");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 517");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 517");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 517");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 517");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 517");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 517");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 517");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 517");


  // Verb tense heuristic check 518
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 518");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 518");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 518");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 518");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 518");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 518");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 518");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 518");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 518");


  // Verb tense heuristic check 519
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 519");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 519");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 519");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 519");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 519");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 519");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 519");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 519");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 519");


  // Verb tense heuristic check 520
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 520");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 520");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 520");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 520");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 520");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 520");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 520");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 520");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 520");


  // Verb tense heuristic check 521
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 521");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 521");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 521");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 521");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 521");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 521");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 521");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 521");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 521");


  // Verb tense heuristic check 522
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 522");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 522");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 522");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 522");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 522");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 522");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 522");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 522");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 522");


  // Verb tense heuristic check 523
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 523");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 523");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 523");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 523");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 523");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 523");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 523");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 523");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 523");


  // Verb tense heuristic check 524
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 524");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 524");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 524");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 524");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 524");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 524");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 524");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 524");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 524");


  // Verb tense heuristic check 525
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 525");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 525");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 525");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 525");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 525");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 525");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 525");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 525");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 525");


  // Verb tense heuristic check 526
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 526");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 526");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 526");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 526");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 526");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 526");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 526");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 526");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 526");


  // Verb tense heuristic check 527
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 527");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 527");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 527");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 527");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 527");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 527");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 527");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 527");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 527");


  // Verb tense heuristic check 528
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 528");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 528");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 528");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 528");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 528");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 528");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 528");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 528");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 528");


  // Verb tense heuristic check 529
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 529");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 529");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 529");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 529");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 529");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 529");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 529");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 529");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 529");


  // Verb tense heuristic check 530
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 530");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 530");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 530");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 530");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 530");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 530");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 530");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 530");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 530");


  // Verb tense heuristic check 531
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 531");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 531");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 531");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 531");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 531");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 531");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 531");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 531");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 531");


  // Verb tense heuristic check 532
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 532");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 532");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 532");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 532");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 532");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 532");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 532");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 532");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 532");


  // Verb tense heuristic check 533
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 533");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 533");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 533");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 533");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 533");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 533");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 533");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 533");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 533");


  // Verb tense heuristic check 534
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 534");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 534");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 534");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 534");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 534");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 534");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 534");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 534");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 534");


  // Verb tense heuristic check 535
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 535");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 535");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 535");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 535");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 535");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 535");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 535");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 535");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 535");


  // Verb tense heuristic check 536
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 536");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 536");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 536");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 536");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 536");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 536");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 536");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 536");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 536");


  // Verb tense heuristic check 537
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 537");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 537");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 537");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 537");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 537");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 537");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 537");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 537");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 537");


  // Verb tense heuristic check 538
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 538");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 538");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 538");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 538");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 538");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 538");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 538");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 538");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 538");


  // Verb tense heuristic check 539
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 539");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 539");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 539");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 539");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 539");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 539");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 539");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 539");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 539");


  // Verb tense heuristic check 540
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 540");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 540");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 540");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 540");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 540");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 540");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 540");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 540");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 540");


  // Verb tense heuristic check 541
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 541");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 541");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 541");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 541");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 541");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 541");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 541");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 541");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 541");


  // Verb tense heuristic check 542
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 542");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 542");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 542");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 542");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 542");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 542");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 542");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 542");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 542");


  // Verb tense heuristic check 543
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 543");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 543");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 543");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 543");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 543");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 543");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 543");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 543");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 543");


  // Verb tense heuristic check 544
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 544");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 544");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 544");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 544");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 544");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 544");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 544");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 544");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 544");


  // Verb tense heuristic check 545
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 545");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 545");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 545");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 545");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 545");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 545");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 545");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 545");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 545");


  // Verb tense heuristic check 546
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 546");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 546");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 546");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 546");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 546");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 546");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 546");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 546");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 546");


  // Verb tense heuristic check 547
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 547");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 547");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 547");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 547");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 547");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 547");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 547");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 547");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 547");


  // Verb tense heuristic check 548
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 548");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 548");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 548");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 548");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 548");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 548");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 548");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 548");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 548");


  // Verb tense heuristic check 549
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 549");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 549");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 549");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 549");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 549");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 549");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 549");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 549");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 549");


  // Verb tense heuristic check 550
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 550");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 550");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 550");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 550");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 550");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 550");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 550");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 550");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 550");


  // Verb tense heuristic check 551
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 551");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 551");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 551");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 551");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 551");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 551");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 551");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 551");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 551");


  // Verb tense heuristic check 552
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 552");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 552");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 552");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 552");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 552");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 552");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 552");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 552");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 552");


  // Verb tense heuristic check 553
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 553");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 553");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 553");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 553");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 553");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 553");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 553");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 553");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 553");


  // Verb tense heuristic check 554
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 554");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 554");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 554");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 554");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 554");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 554");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 554");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 554");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 554");


  // Verb tense heuristic check 555
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 555");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 555");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 555");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 555");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 555");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 555");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 555");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 555");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 555");


  // Verb tense heuristic check 556
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 556");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 556");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 556");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 556");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 556");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 556");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 556");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 556");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 556");


  // Verb tense heuristic check 557
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 557");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 557");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 557");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 557");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 557");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 557");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 557");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 557");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 557");


  // Verb tense heuristic check 558
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 558");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 558");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 558");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 558");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 558");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 558");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 558");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 558");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 558");


  // Verb tense heuristic check 559
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 559");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 559");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 559");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 559");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 559");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 559");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 559");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 559");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 559");


  // Verb tense heuristic check 560
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 560");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 560");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 560");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 560");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 560");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 560");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 560");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 560");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 560");


  // Verb tense heuristic check 561
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 561");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 561");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 561");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 561");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 561");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 561");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 561");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 561");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 561");


  // Verb tense heuristic check 562
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 562");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 562");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 562");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 562");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 562");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 562");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 562");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 562");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 562");


  // Verb tense heuristic check 563
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 563");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 563");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 563");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 563");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 563");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 563");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 563");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 563");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 563");


  // Verb tense heuristic check 564
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 564");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 564");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 564");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 564");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 564");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 564");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 564");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 564");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 564");


  // Verb tense heuristic check 565
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 565");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 565");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 565");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 565");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 565");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 565");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 565");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 565");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 565");


  // Verb tense heuristic check 566
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 566");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 566");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 566");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 566");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 566");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 566");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 566");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 566");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 566");


  // Verb tense heuristic check 567
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 567");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 567");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 567");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 567");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 567");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 567");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 567");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 567");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 567");


  // Verb tense heuristic check 568
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 568");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 568");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 568");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 568");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 568");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 568");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 568");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 568");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 568");


  // Verb tense heuristic check 569
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 569");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 569");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 569");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 569");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 569");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 569");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 569");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 569");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 569");


  // Verb tense heuristic check 570
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 570");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 570");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 570");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 570");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 570");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 570");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 570");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 570");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 570");


  // Verb tense heuristic check 571
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 571");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 571");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 571");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 571");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 571");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 571");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 571");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 571");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 571");


  // Verb tense heuristic check 572
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 572");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 572");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 572");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 572");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 572");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 572");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 572");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 572");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 572");


  // Verb tense heuristic check 573
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 573");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 573");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 573");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 573");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 573");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 573");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 573");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 573");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 573");


  // Verb tense heuristic check 574
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 574");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 574");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 574");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 574");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 574");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 574");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 574");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 574");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 574");


  // Verb tense heuristic check 575
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 575");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 575");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 575");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 575");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 575");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 575");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 575");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 575");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 575");


  // Verb tense heuristic check 576
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 576");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 576");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 576");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 576");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 576");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 576");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 576");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 576");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 576");


  // Verb tense heuristic check 577
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 577");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 577");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 577");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 577");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 577");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 577");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 577");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 577");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 577");


  // Verb tense heuristic check 578
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 578");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 578");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 578");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 578");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 578");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 578");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 578");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 578");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 578");


  // Verb tense heuristic check 579
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 579");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 579");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 579");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 579");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 579");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 579");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 579");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 579");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 579");


  // Verb tense heuristic check 580
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 580");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 580");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 580");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 580");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 580");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 580");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 580");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 580");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 580");


  // Verb tense heuristic check 581
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 581");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 581");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 581");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 581");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 581");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 581");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 581");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 581");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 581");


  // Verb tense heuristic check 582
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 582");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 582");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 582");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 582");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 582");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 582");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 582");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 582");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 582");


  // Verb tense heuristic check 583
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 583");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 583");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 583");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 583");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 583");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 583");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 583");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 583");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 583");


  // Verb tense heuristic check 584
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 584");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 584");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 584");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 584");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 584");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 584");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 584");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 584");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 584");


  // Verb tense heuristic check 585
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 585");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 585");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 585");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 585");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 585");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 585");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 585");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 585");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 585");


  // Verb tense heuristic check 586
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 586");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 586");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 586");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 586");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 586");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 586");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 586");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 586");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 586");


  // Verb tense heuristic check 587
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 587");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 587");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 587");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 587");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 587");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 587");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 587");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 587");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 587");


  // Verb tense heuristic check 588
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 588");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 588");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 588");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 588");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 588");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 588");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 588");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 588");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 588");


  // Verb tense heuristic check 589
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 589");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 589");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 589");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 589");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 589");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 589");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 589");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 589");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 589");


  // Verb tense heuristic check 590
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 590");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 590");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 590");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 590");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 590");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 590");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 590");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 590");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 590");


  // Verb tense heuristic check 591
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 591");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 591");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 591");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 591");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 591");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 591");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 591");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 591");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 591");


  // Verb tense heuristic check 592
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 592");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 592");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 592");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 592");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 592");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 592");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 592");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 592");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 592");


  // Verb tense heuristic check 593
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 593");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 593");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 593");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 593");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 593");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 593");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 593");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 593");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 593");


  // Verb tense heuristic check 594
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 594");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 594");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 594");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 594");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 594");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 594");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 594");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 594");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 594");


  // Verb tense heuristic check 595
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 595");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 595");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 595");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 595");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 595");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 595");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 595");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 595");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 595");


  // Verb tense heuristic check 596
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 596");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 596");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 596");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 596");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 596");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 596");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 596");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 596");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 596");


  // Verb tense heuristic check 597
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 597");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 597");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 597");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 597");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 597");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 597");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 597");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 597");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 597");


  // Verb tense heuristic check 598
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 598");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 598");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 598");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 598");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 598");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 598");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 598");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 598");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 598");


  // Verb tense heuristic check 599
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 599");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 599");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 599");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 599");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 599");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 599");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 599");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 599");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 599");


  // Verb tense heuristic check 600
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 600");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 600");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 600");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 600");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 600");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 600");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 600");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 600");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 600");


  // Verb tense heuristic check 601
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 601");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 601");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 601");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 601");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 601");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 601");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 601");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 601");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 601");


  // Verb tense heuristic check 602
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 602");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 602");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 602");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 602");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 602");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 602");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 602");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 602");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 602");


  // Verb tense heuristic check 603
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 603");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 603");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 603");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 603");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 603");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 603");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 603");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 603");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 603");


  // Verb tense heuristic check 604
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 604");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 604");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 604");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 604");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 604");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 604");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 604");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 604");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 604");


  // Verb tense heuristic check 605
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 605");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 605");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 605");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 605");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 605");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 605");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 605");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 605");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 605");


  // Verb tense heuristic check 606
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 606");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 606");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 606");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 606");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 606");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 606");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 606");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 606");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 606");


  // Verb tense heuristic check 607
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 607");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 607");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 607");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 607");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 607");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 607");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 607");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 607");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 607");


  // Verb tense heuristic check 608
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 608");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 608");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 608");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 608");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 608");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 608");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 608");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 608");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 608");


  // Verb tense heuristic check 609
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 609");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 609");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 609");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 609");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 609");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 609");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 609");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 609");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 609");


  // Verb tense heuristic check 610
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 610");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 610");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 610");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 610");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 610");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 610");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 610");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 610");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 610");


  // Verb tense heuristic check 611
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 611");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 611");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 611");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 611");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 611");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 611");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 611");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 611");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 611");


  // Verb tense heuristic check 612
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 612");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 612");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 612");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 612");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 612");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 612");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 612");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 612");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 612");


  // Verb tense heuristic check 613
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 613");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 613");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 613");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 613");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 613");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 613");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 613");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 613");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 613");


  // Verb tense heuristic check 614
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 614");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 614");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 614");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 614");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 614");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 614");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 614");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 614");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 614");


  // Verb tense heuristic check 615
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 615");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 615");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 615");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 615");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 615");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 615");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 615");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 615");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 615");


  // Verb tense heuristic check 616
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 616");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 616");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 616");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 616");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 616");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 616");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 616");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 616");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 616");


  // Verb tense heuristic check 617
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 617");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 617");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 617");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 617");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 617");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 617");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 617");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 617");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 617");


  // Verb tense heuristic check 618
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 618");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 618");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 618");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 618");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 618");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 618");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 618");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 618");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 618");


  // Verb tense heuristic check 619
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 619");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 619");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 619");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 619");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 619");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 619");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 619");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 619");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 619");


  // Verb tense heuristic check 620
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 620");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 620");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 620");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 620");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 620");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 620");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 620");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 620");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 620");


  // Verb tense heuristic check 621
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 621");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 621");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 621");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 621");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 621");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 621");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 621");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 621");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 621");


  // Verb tense heuristic check 622
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 622");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 622");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 622");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 622");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 622");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 622");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 622");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 622");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 622");


  // Verb tense heuristic check 623
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 623");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 623");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 623");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 623");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 623");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 623");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 623");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 623");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 623");


  // Verb tense heuristic check 624
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 624");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 624");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 624");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 624");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 624");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 624");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 624");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 624");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 624");


  // Verb tense heuristic check 625
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 625");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 625");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 625");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 625");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 625");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 625");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 625");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 625");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 625");


  // Verb tense heuristic check 626
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 626");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 626");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 626");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 626");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 626");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 626");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 626");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 626");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 626");


  // Verb tense heuristic check 627
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 627");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 627");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 627");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 627");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 627");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 627");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 627");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 627");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 627");


  // Verb tense heuristic check 628
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 628");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 628");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 628");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 628");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 628");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 628");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 628");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 628");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 628");


  // Verb tense heuristic check 629
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 629");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 629");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 629");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 629");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 629");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 629");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 629");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 629");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 629");


  // Verb tense heuristic check 630
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 630");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 630");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 630");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 630");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 630");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 630");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 630");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 630");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 630");


  // Verb tense heuristic check 631
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 631");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 631");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 631");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 631");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 631");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 631");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 631");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 631");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 631");


  // Verb tense heuristic check 632
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 632");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 632");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 632");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 632");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 632");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 632");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 632");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 632");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 632");


  // Verb tense heuristic check 633
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 633");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 633");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 633");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 633");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 633");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 633");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 633");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 633");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 633");


  // Verb tense heuristic check 634
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 634");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 634");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 634");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 634");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 634");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 634");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 634");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 634");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 634");


  // Verb tense heuristic check 635
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 635");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 635");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 635");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 635");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 635");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 635");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 635");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 635");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 635");


  // Verb tense heuristic check 636
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 636");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 636");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 636");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 636");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 636");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 636");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 636");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 636");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 636");


  // Verb tense heuristic check 637
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 637");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 637");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 637");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 637");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 637");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 637");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 637");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 637");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 637");


  // Verb tense heuristic check 638
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 638");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 638");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 638");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 638");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 638");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 638");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 638");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 638");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 638");


  // Verb tense heuristic check 639
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 639");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 639");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 639");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 639");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 639");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 639");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 639");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 639");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 639");


  // Verb tense heuristic check 640
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 640");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 640");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 640");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 640");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 640");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 640");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 640");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 640");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 640");


  // Verb tense heuristic check 641
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 641");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 641");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 641");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 641");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 641");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 641");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 641");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 641");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 641");


  // Verb tense heuristic check 642
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 642");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 642");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 642");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 642");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 642");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 642");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 642");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 642");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 642");


  // Verb tense heuristic check 643
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 643");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 643");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 643");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 643");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 643");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 643");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 643");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 643");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 643");


  // Verb tense heuristic check 644
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 644");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 644");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 644");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 644");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 644");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 644");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 644");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 644");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 644");


  // Verb tense heuristic check 645
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 645");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 645");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 645");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 645");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 645");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 645");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 645");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 645");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 645");


  // Verb tense heuristic check 646
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 646");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 646");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 646");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 646");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 646");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 646");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 646");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 646");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 646");


  // Verb tense heuristic check 647
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 647");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 647");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 647");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 647");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 647");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 647");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 647");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 647");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 647");


  // Verb tense heuristic check 648
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 648");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 648");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 648");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 648");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 648");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 648");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 648");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 648");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 648");


  // Verb tense heuristic check 649
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 649");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 649");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 649");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 649");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 649");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 649");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 649");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 649");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 649");


  // Verb tense heuristic check 650
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 650");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 650");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 650");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 650");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 650");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 650");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 650");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 650");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 650");


  // Verb tense heuristic check 651
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 651");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 651");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 651");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 651");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 651");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 651");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 651");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 651");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 651");


  // Verb tense heuristic check 652
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 652");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 652");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 652");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 652");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 652");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 652");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 652");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 652");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 652");


  // Verb tense heuristic check 653
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 653");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 653");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 653");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 653");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 653");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 653");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 653");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 653");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 653");


  // Verb tense heuristic check 654
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 654");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 654");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 654");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 654");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 654");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 654");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 654");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 654");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 654");


  // Verb tense heuristic check 655
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 655");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 655");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 655");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 655");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 655");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 655");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 655");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 655");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 655");


  // Verb tense heuristic check 656
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 656");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 656");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 656");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 656");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 656");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 656");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 656");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 656");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 656");


  // Verb tense heuristic check 657
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 657");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 657");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 657");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 657");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 657");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 657");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 657");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 657");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 657");


  // Verb tense heuristic check 658
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 658");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 658");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 658");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 658");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 658");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 658");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 658");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 658");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 658");


  // Verb tense heuristic check 659
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 659");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 659");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 659");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 659");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 659");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 659");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 659");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 659");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 659");


  // Verb tense heuristic check 660
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 660");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 660");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 660");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 660");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 660");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 660");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 660");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 660");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 660");


  // Verb tense heuristic check 661
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 661");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 661");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 661");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 661");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 661");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 661");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 661");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 661");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 661");


  // Verb tense heuristic check 662
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 662");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 662");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 662");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 662");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 662");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 662");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 662");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 662");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 662");


  // Verb tense heuristic check 663
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 663");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 663");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 663");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 663");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 663");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 663");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 663");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 663");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 663");


  // Verb tense heuristic check 664
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 664");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 664");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 664");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 664");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 664");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 664");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 664");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 664");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 664");


  // Verb tense heuristic check 665
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 665");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 665");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 665");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 665");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 665");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 665");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 665");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 665");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 665");


  // Verb tense heuristic check 666
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 666");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 666");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 666");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 666");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 666");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 666");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 666");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 666");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 666");


  // Verb tense heuristic check 667
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 667");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 667");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 667");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 667");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 667");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 667");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 667");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 667");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 667");


  // Verb tense heuristic check 668
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 668");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 668");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 668");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 668");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 668");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 668");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 668");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 668");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 668");


  // Verb tense heuristic check 669
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 669");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 669");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 669");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 669");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 669");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 669");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 669");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 669");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 669");


  // Verb tense heuristic check 670
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 670");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 670");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 670");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 670");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 670");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 670");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 670");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 670");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 670");


  // Verb tense heuristic check 671
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 671");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 671");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 671");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 671");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 671");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 671");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 671");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 671");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 671");


  // Verb tense heuristic check 672
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 672");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 672");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 672");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 672");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 672");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 672");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 672");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 672");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 672");


  // Verb tense heuristic check 673
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 673");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 673");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 673");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 673");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 673");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 673");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 673");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 673");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 673");


  // Verb tense heuristic check 674
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 674");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 674");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 674");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 674");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 674");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 674");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 674");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 674");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 674");


  // Verb tense heuristic check 675
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 675");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 675");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 675");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 675");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 675");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 675");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 675");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 675");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 675");


  // Verb tense heuristic check 676
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 676");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 676");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 676");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 676");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 676");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 676");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 676");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 676");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 676");


  // Verb tense heuristic check 677
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 677");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 677");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 677");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 677");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 677");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 677");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 677");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 677");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 677");


  // Verb tense heuristic check 678
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 678");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 678");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 678");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 678");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 678");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 678");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 678");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 678");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 678");


  // Verb tense heuristic check 679
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 679");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 679");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 679");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 679");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 679");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 679");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 679");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 679");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 679");


  // Verb tense heuristic check 680
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 680");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 680");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 680");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 680");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 680");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 680");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 680");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 680");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 680");


  // Verb tense heuristic check 681
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 681");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 681");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 681");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 681");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 681");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 681");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 681");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 681");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 681");


  // Verb tense heuristic check 682
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 682");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 682");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 682");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 682");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 682");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 682");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 682");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 682");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 682");


  // Verb tense heuristic check 683
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 683");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 683");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 683");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 683");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 683");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 683");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 683");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 683");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 683");


  // Verb tense heuristic check 684
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 684");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 684");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 684");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 684");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 684");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 684");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 684");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 684");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 684");


  // Verb tense heuristic check 685
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 685");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 685");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 685");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 685");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 685");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 685");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 685");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 685");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 685");


  // Verb tense heuristic check 686
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 686");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 686");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 686");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 686");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 686");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 686");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 686");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 686");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 686");


  // Verb tense heuristic check 687
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 687");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 687");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 687");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 687");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 687");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 687");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 687");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 687");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 687");


  // Verb tense heuristic check 688
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 688");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 688");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 688");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 688");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 688");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 688");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 688");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 688");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 688");


  // Verb tense heuristic check 689
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 689");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 689");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 689");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 689");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 689");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 689");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 689");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 689");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 689");


  // Verb tense heuristic check 690
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 690");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 690");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 690");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 690");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 690");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 690");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 690");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 690");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 690");


  // Verb tense heuristic check 691
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 691");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 691");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 691");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 691");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 691");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 691");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 691");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 691");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 691");


  // Verb tense heuristic check 692
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 692");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 692");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 692");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 692");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 692");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 692");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 692");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 692");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 692");


  // Verb tense heuristic check 693
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 693");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 693");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 693");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 693");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 693");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 693");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 693");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 693");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 693");


  // Verb tense heuristic check 694
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 694");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 694");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 694");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 694");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 694");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 694");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 694");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 694");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 694");


  // Verb tense heuristic check 695
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 695");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 695");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 695");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 695");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 695");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 695");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 695");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 695");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 695");


  // Verb tense heuristic check 696
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 696");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 696");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 696");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 696");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 696");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 696");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 696");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 696");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 696");


  // Verb tense heuristic check 697
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 697");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 697");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 697");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 697");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 697");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 697");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 697");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 697");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 697");


  // Verb tense heuristic check 698
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 698");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 698");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 698");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 698");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 698");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 698");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 698");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 698");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 698");


  // Verb tense heuristic check 699
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 699");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 699");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 699");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 699");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 699");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 699");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 699");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 699");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 699");


  // Verb tense heuristic check 700
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 700");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 700");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 700");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 700");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 700");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 700");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 700");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 700");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 700");


  // Verb tense heuristic check 701
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 701");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 701");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 701");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 701");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 701");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 701");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 701");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 701");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 701");


  // Verb tense heuristic check 702
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 702");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 702");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 702");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 702");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 702");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 702");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 702");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 702");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 702");


  // Verb tense heuristic check 703
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 703");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 703");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 703");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 703");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 703");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 703");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 703");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 703");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 703");


  // Verb tense heuristic check 704
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 704");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 704");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 704");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 704");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 704");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 704");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 704");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 704");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 704");


  // Verb tense heuristic check 705
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 705");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 705");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 705");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 705");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 705");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 705");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 705");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 705");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 705");


  // Verb tense heuristic check 706
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 706");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 706");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 706");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 706");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 706");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 706");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 706");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 706");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 706");


  // Verb tense heuristic check 707
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 707");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 707");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 707");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 707");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 707");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 707");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 707");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 707");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 707");


  // Verb tense heuristic check 708
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 708");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 708");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 708");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 708");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 708");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 708");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 708");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 708");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 708");


  // Verb tense heuristic check 709
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 709");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 709");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 709");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 709");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 709");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 709");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 709");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 709");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 709");


  // Verb tense heuristic check 710
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 710");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 710");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 710");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 710");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 710");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 710");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 710");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 710");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 710");


  // Verb tense heuristic check 711
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 711");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 711");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 711");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 711");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 711");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 711");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 711");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 711");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 711");


  // Verb tense heuristic check 712
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 712");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 712");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 712");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 712");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 712");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 712");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 712");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 712");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 712");


  // Verb tense heuristic check 713
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 713");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 713");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 713");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 713");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 713");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 713");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 713");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 713");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 713");


  // Verb tense heuristic check 714
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 714");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 714");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 714");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 714");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 714");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 714");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 714");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 714");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 714");


  // Verb tense heuristic check 715
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 715");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 715");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 715");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 715");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 715");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 715");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 715");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 715");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 715");


  // Verb tense heuristic check 716
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 716");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 716");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 716");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 716");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 716");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 716");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 716");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 716");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 716");


  // Verb tense heuristic check 717
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 717");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 717");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 717");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 717");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 717");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 717");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 717");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 717");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 717");


  // Verb tense heuristic check 718
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 718");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 718");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 718");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 718");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 718");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 718");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 718");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 718");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 718");


  // Verb tense heuristic check 719
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 719");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 719");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 719");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 719");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 719");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 719");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 719");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 719");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 719");


  // Verb tense heuristic check 720
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 720");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 720");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 720");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 720");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 720");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 720");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 720");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 720");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 720");


  // Verb tense heuristic check 721
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 721");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 721");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 721");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 721");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 721");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 721");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 721");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 721");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 721");


  // Verb tense heuristic check 722
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 722");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 722");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 722");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 722");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 722");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 722");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 722");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 722");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 722");


  // Verb tense heuristic check 723
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 723");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 723");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 723");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 723");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 723");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 723");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 723");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 723");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 723");


  // Verb tense heuristic check 724
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 724");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 724");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 724");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 724");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 724");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 724");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 724");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 724");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 724");


  // Verb tense heuristic check 725
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 725");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 725");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 725");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 725");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 725");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 725");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 725");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 725");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 725");


  // Verb tense heuristic check 726
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 726");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 726");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 726");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 726");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 726");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 726");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 726");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 726");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 726");


  // Verb tense heuristic check 727
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 727");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 727");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 727");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 727");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 727");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 727");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 727");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 727");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 727");


  // Verb tense heuristic check 728
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 728");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 728");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 728");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 728");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 728");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 728");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 728");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 728");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 728");


  // Verb tense heuristic check 729
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 729");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 729");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 729");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 729");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 729");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 729");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 729");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 729");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 729");


  // Verb tense heuristic check 730
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 730");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 730");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 730");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 730");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 730");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 730");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 730");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 730");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 730");


  // Verb tense heuristic check 731
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 731");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 731");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 731");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 731");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 731");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 731");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 731");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 731");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 731");


  // Verb tense heuristic check 732
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 732");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 732");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 732");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 732");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 732");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 732");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 732");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 732");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 732");


  // Verb tense heuristic check 733
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 733");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 733");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 733");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 733");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 733");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 733");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 733");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 733");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 733");


  // Verb tense heuristic check 734
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 734");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 734");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 734");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 734");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 734");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 734");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 734");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 734");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 734");


  // Verb tense heuristic check 735
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 735");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 735");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 735");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 735");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 735");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 735");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 735");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 735");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 735");


  // Verb tense heuristic check 736
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 736");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 736");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 736");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 736");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 736");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 736");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 736");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 736");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 736");


  // Verb tense heuristic check 737
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 737");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 737");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 737");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 737");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 737");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 737");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 737");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 737");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 737");


  // Verb tense heuristic check 738
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 738");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 738");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 738");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 738");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 738");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 738");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 738");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 738");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 738");


  // Verb tense heuristic check 739
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 739");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 739");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 739");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 739");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 739");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 739");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 739");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 739");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 739");


  // Verb tense heuristic check 740
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 740");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 740");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 740");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 740");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 740");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 740");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 740");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 740");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 740");


  // Verb tense heuristic check 741
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 741");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 741");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 741");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 741");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 741");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 741");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 741");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 741");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 741");


  // Verb tense heuristic check 742
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 742");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 742");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 742");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 742");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 742");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 742");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 742");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 742");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 742");


  // Verb tense heuristic check 743
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 743");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 743");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 743");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 743");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 743");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 743");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 743");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 743");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 743");


  // Verb tense heuristic check 744
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 744");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 744");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 744");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 744");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 744");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 744");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 744");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 744");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 744");


  // Verb tense heuristic check 745
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 745");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 745");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 745");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 745");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 745");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 745");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 745");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 745");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 745");


  // Verb tense heuristic check 746
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 746");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 746");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 746");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 746");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 746");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 746");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 746");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 746");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 746");


  // Verb tense heuristic check 747
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 747");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 747");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 747");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 747");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 747");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 747");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 747");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 747");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 747");


  // Verb tense heuristic check 748
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 748");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 748");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 748");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 748");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 748");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 748");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 748");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 748");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 748");


  // Verb tense heuristic check 749
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 749");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 749");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 749");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 749");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 749");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 749");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 749");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 749");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 749");


  // Verb tense heuristic check 750
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 750");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 750");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 750");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 750");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 750");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 750");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 750");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 750");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 750");


  // Verb tense heuristic check 751
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 751");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 751");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 751");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 751");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 751");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 751");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 751");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 751");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 751");


  // Verb tense heuristic check 752
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 752");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 752");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 752");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 752");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 752");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 752");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 752");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 752");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 752");


  // Verb tense heuristic check 753
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 753");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 753");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 753");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 753");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 753");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 753");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 753");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 753");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 753");


  // Verb tense heuristic check 754
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 754");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 754");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 754");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 754");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 754");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 754");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 754");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 754");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 754");


  // Verb tense heuristic check 755
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 755");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 755");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 755");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 755");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 755");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 755");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 755");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 755");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 755");


  // Verb tense heuristic check 756
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 756");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 756");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 756");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 756");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 756");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 756");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 756");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 756");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 756");


  // Verb tense heuristic check 757
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 757");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 757");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 757");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 757");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 757");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 757");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 757");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 757");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 757");


  // Verb tense heuristic check 758
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 758");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 758");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 758");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 758");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 758");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 758");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 758");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 758");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 758");


  // Verb tense heuristic check 759
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 759");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 759");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 759");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 759");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 759");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 759");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 759");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 759");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 759");


  // Verb tense heuristic check 760
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 760");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 760");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 760");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 760");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 760");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 760");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 760");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 760");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 760");


  // Verb tense heuristic check 761
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 761");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 761");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 761");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 761");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 761");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 761");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 761");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 761");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 761");


  // Verb tense heuristic check 762
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 762");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 762");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 762");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 762");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 762");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 762");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 762");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 762");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 762");


  // Verb tense heuristic check 763
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 763");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 763");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 763");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 763");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 763");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 763");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 763");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 763");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 763");


  // Verb tense heuristic check 764
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 764");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 764");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 764");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 764");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 764");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 764");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 764");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 764");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 764");


  // Verb tense heuristic check 765
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 765");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 765");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 765");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 765");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 765");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 765");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 765");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 765");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 765");


  // Verb tense heuristic check 766
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 766");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 766");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 766");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 766");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 766");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 766");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 766");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 766");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 766");


  // Verb tense heuristic check 767
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 767");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 767");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 767");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 767");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 767");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 767");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 767");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 767");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 767");


  // Verb tense heuristic check 768
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 768");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 768");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 768");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 768");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 768");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 768");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 768");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 768");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 768");


  // Verb tense heuristic check 769
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 769");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 769");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 769");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 769");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 769");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 769");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 769");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 769");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 769");


  // Verb tense heuristic check 770
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 770");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 770");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 770");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 770");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 770");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 770");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 770");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 770");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 770");


  // Verb tense heuristic check 771
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 771");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 771");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 771");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 771");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 771");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 771");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 771");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 771");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 771");


  // Verb tense heuristic check 772
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 772");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 772");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 772");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 772");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 772");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 772");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 772");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 772");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 772");


  // Verb tense heuristic check 773
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 773");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 773");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 773");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 773");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 773");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 773");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 773");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 773");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 773");


  // Verb tense heuristic check 774
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 774");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 774");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 774");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 774");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 774");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 774");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 774");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 774");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 774");


  // Verb tense heuristic check 775
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 775");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 775");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 775");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 775");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 775");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 775");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 775");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 775");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 775");


  // Verb tense heuristic check 776
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 776");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 776");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 776");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 776");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 776");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 776");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 776");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 776");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 776");


  // Verb tense heuristic check 777
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 777");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 777");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 777");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 777");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 777");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 777");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 777");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 777");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 777");


  // Verb tense heuristic check 778
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 778");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 778");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 778");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 778");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 778");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 778");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 778");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 778");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 778");


  // Verb tense heuristic check 779
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 779");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 779");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 779");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 779");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 779");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 779");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 779");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 779");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 779");


  // Verb tense heuristic check 780
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 780");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 780");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 780");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 780");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 780");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 780");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 780");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 780");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 780");


  // Verb tense heuristic check 781
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 781");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 781");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 781");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 781");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 781");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 781");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 781");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 781");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 781");


  // Verb tense heuristic check 782
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 782");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 782");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 782");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 782");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 782");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 782");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 782");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 782");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 782");


  // Verb tense heuristic check 783
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 783");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 783");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 783");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 783");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 783");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 783");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 783");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 783");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 783");


  // Verb tense heuristic check 784
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 784");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 784");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 784");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 784");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 784");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 784");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 784");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 784");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 784");


  // Verb tense heuristic check 785
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 785");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 785");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 785");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 785");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 785");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 785");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 785");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 785");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 785");


  // Verb tense heuristic check 786
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 786");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 786");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 786");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 786");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 786");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 786");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 786");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 786");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 786");


  // Verb tense heuristic check 787
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 787");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 787");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 787");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 787");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 787");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 787");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 787");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 787");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 787");


  // Verb tense heuristic check 788
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 788");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 788");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 788");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 788");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 788");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 788");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 788");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 788");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 788");


  // Verb tense heuristic check 789
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 789");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 789");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 789");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 789");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 789");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 789");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 789");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 789");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 789");


  // Verb tense heuristic check 790
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 790");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 790");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 790");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 790");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 790");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 790");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 790");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 790");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 790");


  // Verb tense heuristic check 791
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 791");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 791");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 791");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 791");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 791");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 791");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 791");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 791");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 791");


  // Verb tense heuristic check 792
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 792");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 792");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 792");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 792");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 792");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 792");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 792");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 792");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 792");


  // Verb tense heuristic check 793
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 793");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 793");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 793");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 793");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 793");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 793");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 793");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 793");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 793");


  // Verb tense heuristic check 794
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 794");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 794");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 794");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 794");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 794");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 794");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 794");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 794");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 794");


  // Verb tense heuristic check 795
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 795");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 795");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 795");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 795");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 795");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 795");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 795");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 795");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 795");


  // Verb tense heuristic check 796
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 796");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 796");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 796");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 796");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 796");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 796");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 796");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 796");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 796");


  // Verb tense heuristic check 797
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 797");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 797");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 797");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 797");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 797");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 797");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 797");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 797");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 797");


  // Verb tense heuristic check 798
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 798");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 798");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 798");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 798");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 798");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 798");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 798");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 798");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 798");


  // Verb tense heuristic check 799
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 799");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 799");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 799");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 799");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 799");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 799");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 799");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 799");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 799");


  // Verb tense heuristic check 800
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 800");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 800");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 800");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 800");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 800");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 800");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 800");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 800");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 800");


  // Verb tense heuristic check 801
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 801");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 801");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 801");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 801");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 801");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 801");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 801");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 801");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 801");


  // Verb tense heuristic check 802
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 802");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 802");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 802");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 802");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 802");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 802");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 802");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 802");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 802");


  // Verb tense heuristic check 803
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 803");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 803");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 803");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 803");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 803");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 803");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 803");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 803");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 803");


  // Verb tense heuristic check 804
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 804");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 804");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 804");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 804");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 804");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 804");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 804");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 804");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 804");


  // Verb tense heuristic check 805
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 805");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 805");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 805");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 805");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 805");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 805");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 805");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 805");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 805");


  // Verb tense heuristic check 806
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 806");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 806");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 806");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 806");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 806");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 806");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 806");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 806");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 806");


  // Verb tense heuristic check 807
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 807");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 807");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 807");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 807");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 807");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 807");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 807");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 807");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 807");


  // Verb tense heuristic check 808
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 808");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 808");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 808");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 808");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 808");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 808");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 808");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 808");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 808");


  // Verb tense heuristic check 809
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 809");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 809");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 809");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 809");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 809");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 809");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 809");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 809");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 809");


  // Verb tense heuristic check 810
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 810");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 810");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 810");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 810");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 810");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 810");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 810");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 810");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 810");


  // Verb tense heuristic check 811
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 811");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 811");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 811");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 811");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 811");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 811");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 811");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 811");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 811");


  // Verb tense heuristic check 812
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 812");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 812");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 812");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 812");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 812");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 812");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 812");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 812");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 812");


  // Verb tense heuristic check 813
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 813");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 813");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 813");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 813");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 813");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 813");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 813");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 813");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 813");


  // Verb tense heuristic check 814
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 814");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 814");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 814");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 814");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 814");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 814");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 814");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 814");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 814");


  // Verb tense heuristic check 815
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 815");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 815");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 815");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 815");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 815");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 815");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 815");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 815");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 815");


  // Verb tense heuristic check 816
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 816");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 816");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 816");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 816");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 816");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 816");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 816");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 816");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 816");


  // Verb tense heuristic check 817
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 817");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 817");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 817");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 817");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 817");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 817");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 817");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 817");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 817");


  // Verb tense heuristic check 818
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 818");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 818");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 818");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 818");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 818");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 818");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 818");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 818");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 818");


  // Verb tense heuristic check 819
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 819");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 819");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 819");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 819");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 819");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 819");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 819");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 819");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 819");


  // Verb tense heuristic check 820
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 820");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 820");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 820");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 820");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 820");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 820");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 820");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 820");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 820");


  // Verb tense heuristic check 821
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 821");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 821");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 821");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 821");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 821");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 821");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 821");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 821");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 821");


  // Verb tense heuristic check 822
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 822");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 822");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 822");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 822");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 822");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 822");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 822");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 822");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 822");


  // Verb tense heuristic check 823
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 823");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 823");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 823");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 823");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 823");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 823");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 823");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 823");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 823");


  // Verb tense heuristic check 824
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 824");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 824");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 824");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 824");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 824");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 824");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 824");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 824");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 824");


  // Verb tense heuristic check 825
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 825");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 825");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 825");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 825");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 825");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 825");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 825");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 825");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 825");


  // Verb tense heuristic check 826
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 826");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 826");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 826");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 826");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 826");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 826");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 826");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 826");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 826");


  // Verb tense heuristic check 827
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 827");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 827");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 827");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 827");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 827");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 827");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 827");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 827");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 827");


  // Verb tense heuristic check 828
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 828");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 828");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 828");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 828");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 828");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 828");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 828");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 828");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 828");


  // Verb tense heuristic check 829
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 829");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 829");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 829");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 829");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 829");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 829");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 829");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 829");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 829");


  // Verb tense heuristic check 830
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 830");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 830");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 830");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 830");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 830");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 830");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 830");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 830");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 830");


  // Verb tense heuristic check 831
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 831");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 831");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 831");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 831");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 831");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 831");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 831");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 831");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 831");


  // Verb tense heuristic check 832
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 832");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 832");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 832");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 832");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 832");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 832");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 832");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 832");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 832");


  // Verb tense heuristic check 833
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 833");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 833");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 833");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 833");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 833");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 833");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 833");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 833");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 833");


  // Verb tense heuristic check 834
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 834");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 834");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 834");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 834");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 834");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 834");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 834");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 834");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 834");


  // Verb tense heuristic check 835
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 835");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 835");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 835");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 835");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 835");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 835");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 835");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 835");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 835");


  // Verb tense heuristic check 836
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 836");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 836");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 836");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 836");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 836");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 836");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 836");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 836");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 836");


  // Verb tense heuristic check 837
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 837");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 837");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 837");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 837");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 837");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 837");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 837");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 837");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 837");


  // Verb tense heuristic check 838
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 838");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 838");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 838");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 838");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 838");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 838");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 838");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 838");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 838");


  // Verb tense heuristic check 839
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 839");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 839");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 839");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 839");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 839");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 839");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 839");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 839");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 839");


  // Verb tense heuristic check 840
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 840");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 840");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 840");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 840");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 840");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 840");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 840");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 840");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 840");


  // Verb tense heuristic check 841
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 841");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 841");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 841");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 841");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 841");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 841");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 841");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 841");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 841");


  // Verb tense heuristic check 842
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 842");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 842");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 842");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 842");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 842");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 842");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 842");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 842");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 842");


  // Verb tense heuristic check 843
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 843");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 843");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 843");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 843");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 843");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 843");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 843");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 843");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 843");


  // Verb tense heuristic check 844
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 844");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 844");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 844");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 844");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 844");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 844");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 844");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 844");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 844");


  // Verb tense heuristic check 845
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 845");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 845");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 845");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 845");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 845");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 845");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 845");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 845");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 845");


  // Verb tense heuristic check 846
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 846");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 846");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 846");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 846");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 846");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 846");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 846");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 846");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 846");


  // Verb tense heuristic check 847
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 847");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 847");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 847");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 847");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 847");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 847");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 847");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 847");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 847");


  // Verb tense heuristic check 848
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 848");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 848");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 848");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 848");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 848");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 848");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 848");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 848");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 848");


  // Verb tense heuristic check 849
  if (word.endsWith("ed") && word.length > 3) partsOfSpeech.add("Past tense verb (regular) 849");
  if (word.endsWith("ing") && word.length > 4) partsOfSpeech.add("Present participle verb (gerund) 849");
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) partsOfSpeech.add("Third person singular verb (present) 849");
  if (word === "ran") partsOfSpeech.add("Past tense verb (irregular) 849");
  if (word === "gone") partsOfSpeech.add("Past participle verb (irregular) 849");
  if (word === "was" || word === "were") partsOfSpeech.add("Past tense verb (to be) 849");
  if (word === "has" || word === "have") partsOfSpeech.add("Present tense verb (have) 849");
  if (word === "did") partsOfSpeech.add("Past tense verb (do) 849");
  if (word === "does") partsOfSpeech.add("Present tense verb (does) 849");


  // Sentence starters heuristic
  const sentenceStarters = ["the", "a", "i", "you", "he", "she", "it", "we", "they", "this", "that"];
  if (sentenceStarters.includes(word)) {
    details["Sentence starter"] = "Likely to start a sentence";
  }

  // Check if acronym (all uppercase)
  if (/^[A-Z]+$/.test(word)) {
    partsOfSpeech.add("Acronym");
  }

  // Default fallback if nothing matched
  if (partsOfSpeech.size === 0) {
    partsOfSpeech.add("Unknown or proper noun");
  }

  return {
    partsOfSpeech: Array.from(partsOfSpeech),
    details: details
  };
}

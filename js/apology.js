// Decides whether what someone typed on the lockout page is a real apology.
// Returns { ok, reply }: `reply` is the eye's answer when it isn't accepted.
//
// A real apology must:
//   - contain an apology phrase as whole words ("sorry", "I apologize",
//     "forgive me", "my bad", ...), not buried inside another word
//   - not take it back ("not sorry", "sorry not sorry", "jk", "lol", ...)
//   - be made of real-looking words, not keyboard mashing
//   - if it's longer than a few words, actually be about you ("I", "me", "my")
//     rather than a random sentence that happens to include "sorry"

const APOLOGY = /\b(sorry|apologi[sz]e[ds]?|apologies|my bad|forgive me|pardon me|i regret|i was wrong|i messed up|my fault)\b/;
const TAKEN_BACK =
  /\b(not|never|no|isn'?t|aren'?t|ain'?t|wasn'?t|won'?t|don'?t|nope)\b[^.!?]{0,20}\b(sorry|apologi|forgive|regret)|\bsorry,? not sorry\b|\b(jk|lol|lmao|lmfao|kidding|whatever|psych|sike)\b|\/s\b/;
const ABOUT_ME = /\b(i|i'm|im|i've|i'll|me|my|mine|myself|we|us|our)\b/;
const VOWEL = /[aeiouy]/;

function looksLikeWord(word) {
  if (word.length > 15) return false; // nobody needs words this long here
  if (/(.)\1\1/.test(word)) return false; // "sooorrry", "aaaa"
  if (word.length > 3 && !VOWEL.test(word)) return false; // "sdfgh"
  if (/[^aeiouy']{5,}/.test(word)) return false; // long consonant runs
  return true;
}

export function judgeApology(text) {
  const said = text.trim().toLowerCase();
  const words = said.match(/[a-z']+/g) || [];

  if (!words.length) return { ok: false, reply: "The eye is waiting for you to say something." };

  // Mostly symbols or digits, or words that aren't words: keyboard mashing.
  const letters = (said.match(/[a-z]/g) || []).length;
  const junk = said.replace(/[a-z'\s.,!?]/g, "").length;
  if (junk > letters * 0.2 || words.filter((w) => !looksLikeWord(w)).length > words.length * 0.2) {
    return { ok: false, reply: "The eye can't make sense of that. Use real words." };
  }

  if (TAKEN_BACK.test(said)) return { ok: false, reply: "The eye can tell you don't mean it." };
  if (!APOLOGY.test(said)) return { ok: false, reply: "That is not an apology." };
  if (words.length > 3 && !ABOUT_ME.test(said)) {
    return { ok: false, reply: "Whose apology is that? Say it like you mean it." };
  }
  return { ok: true };
}

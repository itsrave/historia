/*global Autocompleter, targetHandler */
/*exported completer */

let completer = new Autocompleter({
  container: document.getElementById("search"),
  completions: [],
  options: {
    focus: true,
    caseInsensitive: true,
    resultLimit: 5,
    highlightClass: "search-highlight",
    emptyPlaceholder: "szukaj nauczyciela lub sali…",
    onlyKnownCompletions: true,
  },
  callback: targetHandler,
});

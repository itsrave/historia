/* Wywołuje pełny erkan po kliknięciu na stronie. Nie działa z IE (bo całość i
 * tak nie będzie działać, gdzyż IE nie ma es6). */

/* Konieczne jest kliknięcie, gdyż pełen ekran nie może być wywołany bez
 * interakcji użytkownika. */

window.addEventListener(
  "click", () => document.documentElement
  [["requestFullscreen",
    "webkitRequestFullscreen",
    "mozRequestFullScreen"]
   .find(fun => typeof document.documentElement[fun] === "function")]());

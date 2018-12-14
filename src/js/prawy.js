/* Ten plik zajmuje się ustalaniem zawartości prawej strony monitora. Docelowo
 * będzie się dać zmienić jej typ pomiędzy tabelami z zastępstwami i pokazem
 * obrazków za pomocą klawisza. */

let prawy = {
  typ: "nie zainicjowany",
  get zawartosc () {
    return this.typ;
  },
  set zawartosc (x) {
    if (["zastepstwa", "slajdy"].includes(x)) {
      clearInterval(timeoutZastepstw);
      this.typ = x;
    } else
      throw `nieznany typ zawarto\u015Bci: ${x}`;

    switch (x) {
    case "zastepstwa":
      ogarnijZastepstwa();
      timeoutZastepstw = setTimeout(ogarnijZastepstwa, 300000); // co 5 minut
      break;
    case "slajdy":

      break;
    }
  },
};

// wstępne ustawienie typu
prawy.zawartosc = "zastepstwa";

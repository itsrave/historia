/* global $ */

/* Ten kod powinien być wyczyszczony, bo miejscami jest zbyt paskudny by się
 * nadawał do czegokolwiek niż do sprawdzania, czy jakoś działa. */

/* Ustawienia lokalizacji tabelek z planami lekcji. */
const folderLista = "plan",                 // folder z planami
      nazwaListy = "lista.html",            // nazwa pliku z listą planów
      serwer = window.location.origin;      // serwer z planami

/* Ładne napisy do wyświetlania przed i po lekcjach oraz nazwy dni tygodnia
 * oraz miesięcy. */
const koniecLekcji = "koniec zaj\u0119\u0107",
      przedLekcjami = "---",
      // z jakiegoś powodu niedziela ma index 0 (burgery)
      dniTygodnia = ["Niedziela", "Poniedzia\u0142ek", "Wtorek", "\u015Aroda",
                     "Czwartek", "Pi\u0105tek", "Sobota"],
      // odmienione przez przypadki
      miesiace = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
                  "lipca", "sierpnia", "wrze\u015Bnia", "pa\u017Adziernika",
                  "listopada", "grudnia"];

/* odsunięcie Date do obecnej godziny lekcyjnej w minutach */
const przesuniecieGodzinyLekcyjnej = 5;

/* Zmienne do przechowywania danych o planach lekcji. */
let plany,                      // lista planów lekcji
    dzwonki,                    // lista godzin lekcyjnych w szkole
    nrPierwszejLekcji;

/* Złączyłem wszystko w jedną funkcję bo nie ma sensu chyba tego dzielić na
 * mniejsze części. */
function zaladujListe (adres, nastepnie) {
  /* Pobiera dokument z listą oddziałów z adresu i tworzy listę linków do
   * planów poszczególnych oddziałów, a następnie dodaje je z tej listy.
   *
   * Następnie to callback wywoływany po przeparsowaniu ostatniego planu. Ten
   * argument nie może nazywać się callback, ponieważ konfliktuje to z nazwami
   * argumentów w funkcji z jQuery. */

  $.get(adres,                  // załaduj dane
        (data) => {
          let html = $.parseHTML(data), // wczytaj do tablicy
              oddzialy = [];    // tutaj będzie lista linków do oddziałów

          $.each(html, (index, value) => { // znajdź tabelę
            if (value.nodeName === "TABLE")
              oddzialy = $(value).find("#oddzialy .el a");
          });

          // zmień oddzialy na listę linków i napraw je
          let obecnyFolder = window.location.href,
              wlasciwyfolder = [serwer, folderLista].join("/");
          obecnyFolder = obecnyFolder.substring(0, obecnyFolder.lastIndexOf("/"));

          for (let i = 0; i < oddzialy.length; i++)
            oddzialy[i] = oddzialy[i].href
            .replace(obecnyFolder, wlasciwyfolder);

          // dodaj klasy na podstawie każdego oddziału
          for (let i = 0; i < oddzialy.length; i++)
            $.get(oddzialy[i],
                  (data) => {
                    function oddzial () {} // konstruktor

                    let html = $.parseHTML(data),
                        nowaKlasa = new oddzial();

                    for (let i = 0; i < html.length; i++) {
                      let element = html[i];
                      if (element.className === "tabtytul") // nazwa klasy
                        nowaKlasa.nazwa = $(element).find(".tytulnapis")[0].innerText;
                      else if (element.nodeName === "DIV") // tabela z planem lekcji
                        nowaKlasa.tabela = $(element).find(".tabela")[0];
                    }
                    plany.push(nowaKlasa);

                    /* Mogą wystąpić problemy jeśli łącze jest wolne (testy
                     * nic nie wykazały, ale nie jestem pewien na 100%). */

                    /* Jeśli lista dzwonków jest pusta, to zrób ją na
                     * podstawie pierwszej tabeli */
                    if (dzwonki.length === 0) {
                      /* tworzy listę z dzwonkami z pierwszej tabeli */

                      function Dzwonek (godziny) {
                        /* Konstruktor obiektu z dzwonkiem.
                         *
                         * Jedyny argument to Array z 2 stringami z godziną
                         * zapisaną w ten sposób: "HH:SS". Pierwszy z nich to
                         * początek godziny lekcyjnej, a drugi to koniec. */

                        function Godzina (godzina) {
                          /* Konstruktor obiektu z godziną. */
                          godzina = godzina.split(":");

                          this.h = Number(godzina[0]); // godzina
                          this.m = Number(godzina[1]); // minuta
                        }

                        this.poczatek = new Godzina(godziny[0]);
                        this.koniec = new Godzina(godziny[1]);
                      }

                      let doDzwonkow = plany[0].tabela.rows;
                      /* pierwszy rząd tabelki zawiera etykiety kolumn, więc
                       * go pomijam */
                      for (let i = 1; i < doDzwonkow.length; i++) {
                        // ogarnij numer pierwszej lekcji
                        if (nrPierwszejLekcji === undefined)
                          nrPierwszejLekcji =
                          Number($(doDzwonkow[i]).find(".nr")[0].innerText);

                        // tekst z godzinami dzwonka w rzędzie tabeli
                        let dzwonek = $(doDzwonkow[i]).find(".g")[0]
                            .textContent;
                        // usuń spacje (z jakiegoś powodu w tabelkach znajdują
                        // się spacje w niektórych komórkach)
                        dzwonek = dzwonek.replace(/\s/g, "");
                        // rozdziel na początek i koniec
                        dzwonek = dzwonek.split("-");
                        // zrób obiekt
                        dzwonek = new Dzwonek(dzwonek);
                        // dodaj uzyskane dane do tabeli z dzwonkami
                        dzwonki.push(dzwonek);
                      }
                    }

                    /* Zakładam, że wszystkie oddziały mają każdą godzinę
                     * lekcyjną w tabelce i mogę wziąć wszystkie godziny z
                     * dowolnej tabelki. */

                    /* Przeczytaj właśnie dodany plan. */
                    let dodanyPlan = plany.length - 1;
                    /* Zrób Array o długości odpowiadającej ilości dzwonków
                     * wypełnione pustymi stringami. */
                    let pustyPlan = [];
                    for (let i = 0; i < dzwonki.length; i++)
                      pustyPlan.push("");

                    /* Stwórz tabelę z tabelami o długości odpowiadającej
                     * ilości dni w tygodniu. */
                    plany[dodanyPlan].plan = [];
                    for (let i = 0; i < 7; i++)
                      plany[dodanyPlan].plan.push(pustyPlan.slice(0));

                    /* Dodaj do tabeli zawartość. */
                    for (let kolumna = 1;
                         /* pierwszy rząd zawiera tylko etykiety kolumny w
                          * tabeli */
                         kolumna < plany[dodanyPlan].tabela.rows.length;
                         kolumna++) {
                      let rzad = plany[dodanyPlan].tabela.rows[kolumna];
                      for (let komorka = 2;
                           /* indeks pierwszej komórki z istotnymi danymi */
                           komorka < rzad.children.length;
                           komorka++) {

                        /* Tutaj znajduje się troszkę kodu, bo innerText
                         * powinien działać jak textContent jeśli node nie
                         * jest renderowane. Pewnie da się to napisać
                         * ładniej.
                         *
                         * https://html.spec.whatwg.org/multipage/dom.html#the-innertext-idl-attribute */
                        
                        let tresc = rzad.children[komorka].children,
                            zawartosc = [];

                        for (let x of tresc)
                          zawartosc.push((x.nodeName === "BR") ?
                                         "<br>" : x.textContent);

                        // jeśli nie zawiera <br>, to nie jest to lekcja
                        // podzielona na grupy i trzeba rozdzielać spacjami
                        zawartosc =
                          zawartosc.join((zawartosc.includes("<br>")) ?
                                         "" : " ");

                        // jeśli w danej godzinie jest lekcja
                        if (lekcjaNieJestPusta(zawartosc))
                          plany[dodanyPlan].plan[komorka - 2][kolumna - 1]
                          = zawartosc;
                      }
                    }

                    // Przesuń plan, by ostatnia godzina lekcyjna się
                    // zgadzała. Zakładam że plan lekcyjny jest podawany od
                    // poniedziałku.
                    plany[dodanyPlan].plan
                      .unshift(plany[dodanyPlan].plan.pop());

                    // tabela jest już nie potrzebna
                    delete plany[dodanyPlan].tabela;


                    if (oddzialy.length === plany.length) {
                      // posortuj
                      plany.sort((a,b) => (a.nazwa.localeCompare(b.nazwa) > 0));
                      znajdzOstatnieLekcje();
                      nastepnie(); // callback
                    }
                  });
        });
}

function lekcjaNieJestPusta (lekcja) {
  /* Podaje, czy string z daną lekcją jest pusty. */
  return /\S/.test(lekcja);
}

function wyswietlPlany (obecnaGodzina, dzienTygodnia) {

  function ladnaNazwaKlasy (nazwa) {
    /* Bardzo chamskie, ale działa. Może przestać, jeśli coś się zmieni w
     * konwencji nazywania klas, ale wtedy wystarczy zmienić ten kod. */
    // return nazwa.split(" ")[1];
    return nazwa;
  }

  let divy = document.querySelectorAll(".oddzial");

  // Błąd jeśli jest za dużo klas w szkole. W komunikacie nie ma polskich
  // znaków na wszelki wypadek.
  if (plany.length > divy.length)
    throw "Za du\u017Co oddzia\u0142\u00F3w \u017Ceby dobrze je\
 wy\u015Bwietla\u0107";

  divy.forEach((element, index) => {
    if (index >= plany.length)
      element.style.display = "none";
    else {
      element.style.display = "block";

      let klasa = plany[index];
      element.children[0].innerText = ladnaNazwaKlasy(klasa.nazwa);
      let lekcja;
      if (obecnaGodzina === -1) // po ostatniej lekcji
        lekcja = koniecLekcji;
      else
        lekcja = klasa.plan[dzienTygodnia][obecnaGodzina];

      if (!lekcjaNieJestPusta(lekcja)) { // jeśli nie ma żadnej lekcji w planie
        if (klasa.ostatnieLekcje[dzienTygodnia] <= obecnaGodzina)
          lekcja = koniecLekcji;
        else
          lekcja = przedLekcjami;
      }

      element.children[1].innerHTML = lekcja;
    }
  });

}

function znajdzOstatnieLekcje () {
  /* Znajduje ostatnie lekcje w każdym planie. -1 oznacza, że danego dnia nie
   * ma żadnych lekcji. */
  plany.forEach(klasa => {        // każda klasa
    klasa.ostatnieLekcje = [];    // nowe Array z ostatnimi lekcjami
    klasa.plan.forEach(dzien => { // każdy dzień tygodnia
      let ostatniaLekcja = -1;    // początkowa wartość
      dzien.forEach((lekcja, index) => { // każda lekcja
        if (lekcjaNieJestPusta(lekcja))
          ostatniaLekcja = index;
      });
      klasa.ostatnieLekcje.push(ostatniaLekcja);
    });
  });
}

function obecnaGodzina (test = []) { // opcjonalny argument do testów
  /* Zwraca obecną bądź następną godzinę lekcyjną, lub -1 jeśli jest już po
   * ostatniej. Funkcja może mieć podany argument z array z godziną i minutami
   * jako opcjonalny argument do testowania. */

  let terazDate = new Date();      // obiekt date do wyciągania z niego danych

  /* Przesuń czas obecnej godziny lekcyjnej w przyszłość. */
  terazDate.setMinutes(terazDate.getMinutes() + przesuniecieGodzinyLekcyjnej);

  let teraz = terazDate.getTime(), // do porównań
      /* obecna godzina lekcyjna (specjalna wartość zwracana przed (i w ciągu)
       * pierwszej godziny lekcyjnej) */
      obecna = 0;
  // do testów
  if (test.length !== 0) {
    teraz = czasZGodziny(test[0], test[1]);
    terazDate = new Date(teraz);
  }

  function czasZGodziny (h, m) {
    return new Date(
      terazDate.getFullYear(),
      terazDate.getMonth(),
      terazDate.getDate(),
      h, m).getTime();
  }

  for (let i = 0; i < dzwonki.length; i++) {
    /* uwaga na zwróconą wartość - może wychodzić poza Array i wymaga
     * pilnowania */
    if (teraz >= czasZGodziny(dzwonki[i].koniec.h,
                              dzwonki[i].koniec.m))
      obecna = i + 1;
  }

  /* Sprawdza, czy jest już po ostatniej lekcji. Ze względu na kod wcześniej
   * test jest troszkę dziwny i indeks Array musi mieć odjęte 1 żeby nie
   * wychodzić poza nie. */
  if (obecna === dzwonki.length &&
      teraz >= czasZGodziny(dzwonki[obecna - 1].koniec.h,
                            dzwonki[obecna - 1].koniec.m))
    obecna = -1;                // specjalna wartość - po ostatniej lekcji

  return obecna;
}

function wyswietlObecnePlany () {
  /* Wyświetla obecne plany lekcji. */
  let dzwonek = obecnaGodzina();
  wyswietlPlany(dzwonek, new Date().getDay());
  ogarnijInformacje(dzwonek);
  // console.log("od\u015Bwie\u017Cono plany");
}


function poprawNumer (numer) {
  /* Wyświetla jednocyfrowe liczby jako dwie cyfry żeby godzina wyglądała
   * normalnie. Nie przejmuje się negatywnymi liczbami. */
  return (numer < 10) ? "0" + String(numer) : numer;
}


function ogarnijInformacje (godzinaLekcyjna) {
  let czas = new Date(),
      tekstDzwonka, tekstDaty;

  if (godzinaLekcyjna === -1) {
    tekstDzwonka = koniecLekcji;
  } else {
    let dzwonek = dzwonki[godzinaLekcyjna];
    tekstDzwonka = poprawNumer(dzwonek.poczatek.h) + ":" +
      poprawNumer(dzwonek.poczatek.m) + "&nbsp;-&nbsp;" +
      poprawNumer(dzwonek.koniec.h) + ":" + poprawNumer(dzwonek.koniec.m);
  }
  document.getElementById("godzinaLekcyjna").innerHTML = tekstDzwonka;

  tekstDaty = dniTygodnia[czas.getDay()] + ", " + czas.getDate() +
    "&nbsp;" + miesiace[czas.getMonth()] + "&nbsp;" + czas.getFullYear();
  document.getElementById("data").innerHTML = tekstDaty;
}

function listaDzwonkow () {
  /* Robi listę dzwonków. */
  let lista = document.getElementById("dzwonki"),
  nrDzwonka = nrPierwszejLekcji;

  lista.innerHTML = "";

  dzwonki.forEach(dzwonek => {
    let element = document.createElement("div"),
    nr = document.createElement("span"),
    nrText = document.createTextNode(nrDzwonka++ + ". "),
    elementText = document.createTextNode(
      poprawNumer(dzwonek.poczatek.h) + ":" +
        poprawNumer(dzwonek.poczatek.m) + " - " +
        poprawNumer(dzwonek.koniec.h) + ":" +
        poprawNumer(dzwonek.koniec.m));
    nr.appendChild(nrText);
    element.appendChild(nr);
    element.appendChild(elementText);
    lista.appendChild(element);
  });

}

function parsujPlany () {
  // czyszczenie zmiennych z danymi
  plany = [];
  dzwonki = [];
  nrPierwszejLekcji = undefined;

  zaladujListe([serwer, folderLista, nazwaListy].join("/"),
               () => {          // callback do testów
                 wyswietlObecnePlany();
                 // odświeża obecne plany lekcji
                 setInterval(wyswietlObecnePlany, 15000); // co 15 sekund

                 listaDzwonkow();
               });
}

parsujPlany();

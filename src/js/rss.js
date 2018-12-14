// Czytnik rss do szkoły
const rssAdress = "test/rss.xml";

let animacjaJużJest = false;

function ogarnijRss (adress) {
  $.get(adress, function (x) {
    let tytuly = [];                     // tablica z tytułami artykułów
    $(x).find("item").each(function () { // dodaj każdy do tablicy
      tytuly.push(($(this).find("title").text()));
    });
    // ustaw zawartość paska
    document.getElementById("trescRSS").innerText = tytuly.join(" | ");
  });
}

function poprawAnimacje () {
  let pasek = document.getElementById("trescRSS"),
      szerokoscPaska = pasek.scrollWidth,
      szerokoscEkranu = window.innerHeight,
      doPrzewiniecia = szerokoscPaska - szerokoscEkranu,
      dlugoscAnimacji = doPrzewiniecia / window.innerHeight * 2;

  // wyczyść margines
  pasek.style.transition = "";
  pasek.style.marginLeft = "0px";

  /* TO NIE DZIAŁA */
  // ustaw nowe przewijanie
  pasek.style.transition = "margin-left " + dlugoscAnimacji + "s " + "linear";
  pasek.style.marginLeft = "-" + doPrzewiniecia + "px";

  setTimeout(poprawAnimacje, (dlugoscAnimacji * 1000));
}

// wywołanie czytnika
ogarnijRss([window.location.origin, rssAdress].join("/"));

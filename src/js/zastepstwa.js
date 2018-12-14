/*global $ */
/* Parser tabliczek z zastępstawmi. Używa jQuery. BARDZO paskudny kod. */

const folderZastepstwa = "zastepstwa",
      plikZastepstwa = "zastepstwa.html";

const zastepstwaHTML =
      '<div id="napisZastepstwa">Zast\u0119pstwa:</div>\
<div id="zastepstwa"></div>';

function ogarnijZastepstwa () {
  document.getElementById("prawy").innerHTML = '<div id="zastepstwa"></div>';
  
  let adres =
      [window.location.origin, folderZastepstwa, plikZastepstwa]
      .join("/"),
      divZastepstwa = document.getElementById("zastepstwa");

  // czyści div z zastępstwami
  divZastepstwa.innerHTML = "";

  $.get(adres,
        (data) =>
        $("<div/>").html(data).find("table")
        .each((index, value) => {
          // paskudna zmiana treści nagłówka z nazwą kolumny z numerem lekcji
          value.rows[1].children[0].innerText = "Nr";

          // dodaj tabelkę do divu z zastępstwami
          divZastepstwa.innerHTML += value.outerHTML;
        }));
}

// uruchom kod
ogarnijZastepstwa();
setInterval(ogarnijZastepstwa, 300000); // co 5 minut

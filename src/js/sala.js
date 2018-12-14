/* global URL, getText */
const n = (() => {
  const {hash} = window.location;

  if (hash.length === 0) {
    console.warn("Brak podanego numeru sali");
    return 1;
  } else {
    return hash.replace("#", "");
  }
})();

const directory = "plan",
      ownerFile = "../opiekunowie/opiekunowie.txt",
      ownerPrefix = "Opekun sali:",
      ownerPrefixPlural = "Opiekunowie sali:",
      emptyPlaceholder = "\u2015".repeat(3),
      address =
      `${window.location.origin}/${directory}/plany/s${n}.html`;

let table, hours;

const getDocument = (address) => new Promise((resolve, reject) => {
  let request = new XMLHttpRequest();

  request.addEventListener("readystatechange", () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        resolve(request.responseXML);
      } else {
        reject(request);
      }
    }
  });

  request.open("GET", address);
  request.responseType = "document";
  request.send();
});

const weekDay = () => new Date().getDay();

const showDay = (day) => {
  if (day > 0 && day < 6) {
    day -= 1;
  } else {
    return;
  }

  [...table.rows].forEach(
    (row) => [...row.cells].slice(2).forEach(
      (cell, index) => cell.style.display =
        (day === index) ? "table-cell" : "none"));
};

const getHours = () =>
      hours = [...table.rows].slice(1)
      .map((row) => [...row.cells][1].textContent.split("-")
           .map((hour) => hour.split(":")
                .map((numberString) => parseInt(numberString, 10))));

const currentHour = (time = new Date()) =>
      hours.findIndex((hour) => hourTimeStamp(hour[1]) >= time);

const highlightHour = (hourIndex) =>
      [...table.rows].slice(1).forEach(
        (row, index) => row.className =
          (index === hourIndex) ? "highlight" : "");

const hourTimeStamp = ([hour, minute, second = 0]) => {
  let timeStamp = new Date();
  timeStamp.setHours(hour);
  timeStamp.setMinutes(minute);
  timeStamp.setSeconds(second);
  return timeStamp;
};

const uniquify = (array) => array.reduce(
  (current, next) =>
    (current.includes(next)) ?
    current : [...current, next],
  []);


getDocument(address)
  .then((response) => {
    let titleElement = document.createElement("h1"),
        title = document.createTextNode(
          response.querySelector(".tytulnapis").textContent),
        tableElement = response.querySelector(".tabela");

    table = tableElement;

    titleElement.appendChild(title);
    document.body.prepend(tableElement);
    document.body.prepend(titleElement);
  })
  .then(getHours)
  .then(() => {
    const intervalHandler = () => {
      showDay(weekDay());
      highlightHour(currentHour());
    };

    setInterval(intervalHandler, 15000);
    intervalHandler();
  })
  .then(() =>
        Object.keys(table.attributes).map(
          (attribute) => table.attributes[attribute])
        .forEach((attribute) => table.removeAttribute(attribute.name)))
  .then(() =>
        [...document.querySelectorAll("tr *")].forEach((element) => {
          let text = element.textContent;
          if (text.trim().length === 0) {
            element.textContent = emptyPlaceholder;
            element.style.textAlign = "center";
          }
        }))
  .then(                        // this should read a list file instead
    () => Promise.all(
      uniquify([...document.querySelectorAll(".n")]
               .map((element) => element.href))
        .map((href) =>
             getDocument(`${window.location.origin}/${directory}\
/plany${href.substring(href.lastIndexOf("/"))}`)
             .then((response) => ({
               url: response.URL,
               name: response.querySelector(".tytulnapis").textContent
                 .replace(/\s*\(.*\)$/, "")
                 .replace(".", ". "),
             }))))
      .then((objs) =>
            [...document.querySelectorAll(".n")].forEach((element) => {
              const file = (link) =>
                    link.substring(link.lastIndexOf("/") + 1);

              let href = file(element.href),
                  matchingObj = objs.find(
                    (obj) => href === file(obj.url)) || {};

              element.textContent = matchingObj.name || element.textContent;
            })))
// append owners
  .then(() => getText(ownerFile)
        .then((data) => String(data).split("\n")
              .reduce((acc, next) => {
                let line = next.split(":").map((string) => string.trim());
                if (line[1]) {
                  acc[line[0]] = line[1];
                }
                return acc;
              }, {})))
  .then((owners) => {
    let div = document.createElement("div"),
        roomNumber = String(document.querySelector("h1").textContent),
        owner;

    roomNumber = roomNumber.substring(0, roomNumber.indexOf(" "));
    owner = owners[roomNumber];

    if (owner) {
      div.append(document
                 .createTextNode(`${(owner.split(",").length > 1) ?
ownerPrefixPlural : ownerPrefix} ${owner}`));
      document.body.append(div);
    }
  })
  .catch(console.error);

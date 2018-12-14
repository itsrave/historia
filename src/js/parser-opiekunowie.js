/* global getText */
const fileAddress = "../opiekunowie/opiekunowie.txt";

let result;

getText(fileAddress)
  .then((data) => String(data).split("\n")
        .reduce((acc, next) => {
          let line = next.split(":").map((string) => string.trim());
          if (line[1]) {
            acc[line[0]] = line[1];
          }
          return acc;
        }, {}))
  .then(console.log)
  .catch(console.error);

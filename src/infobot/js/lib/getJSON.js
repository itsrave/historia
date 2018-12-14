/*global fetch */

const getJSON = (file) => new Promise(
  (resolve, reject) => fetch(file)
    .then((response) => {
      if (response.ok) {
        response.json()
          .then((jsonData) => resolve(jsonData))
          .catch((error) => reject(error));
      } else {
        reject(response);
      }
    }));

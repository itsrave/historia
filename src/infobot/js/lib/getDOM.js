const getDOM = (address) => new Promise((resolve, reject) => {
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

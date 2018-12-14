/*global getDOM */
const insertSVG = (address, element) => getDOM(address)
      .then((svgDOM) => element.appendChild(svgDOM.documentElement));

/* global getText, performance */
(() => {
  const newsPath = "/zastepstwa/aktualnosci.txt",
        newsInterval = 1000 * 5;

  const animationSpeed = 60,
        animationStop = 2000;

  let lastFrame = performance.now(),
      textElement = document.getElementById("aktualnosciText"),
      textContainer = document.getElementById("aktualnosci"),
      margin = 0,
      windowWidth, textWidth;

  const updateText = () =>
        getText(newsPath)
        .then((data) => {
          textElement.innerHTML = data;
          textWidth = textElement.offsetWidth;
        })
        .catch(console.error);

  updateText();
  setInterval(updateText, newsInterval);

  const getWindowWidth = () =>
        windowWidth = textContainer.offsetWidth;

  getWindowWidth();
  window.addEventListener("resize", getWindowWidth);

  const animateNews = (currentTime) => {
    requestAnimationFrame(animateNews);
    let timeDelta = currentTime - lastFrame;

    margin = margin - (timeDelta / windowWidth * animationSpeed);

    if (margin < -textWidth) {
      margin = windowWidth;
    }

    textElement.style.marginLeft = `${margin}px`;

    lastFrame = currentTime;
  };

  requestAnimationFrame(animateNews);
})();

const separator = "-",
      fallbackHash = "#5-6",
      frameContent = "sala.html";

let hash = window.location.hash || fallbackHash,
    frames = [...document.querySelectorAll(".classroom")],
    hashes = hash
    .replace("#", "")
    .split(separator)
    .map((number) => `#${number}`);

frames.forEach(
  (frame, index) => frame.src = `${frameContent}${hashes[index]}`);

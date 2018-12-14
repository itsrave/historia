const adresses = {
  techniczna: "waldemar.podstawka@lckziu.lublin.eu",
  sprzet: "pawel.czapinski@lckziu.lublin.eu",
};

const updateAction = () => {
  document.getElementById("formularz").action =
    `mailto:${adresses[
      document.querySelector("input[type=radio][name=typUsterki]:checked").value]}`;
};

updateAction();

[...document.querySelectorAll("input[name=typUsterki]")]
  .forEach((element) => element.addEventListener("click", updateAction));

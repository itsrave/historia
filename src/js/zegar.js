const months = ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca",
                "Lipca", "Sierpnia", "Września", "Października", "Listopada",
                "Grudinia"],
      weekDays = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek",
                  "Piątek", "Sobota"];

const clockElement = document.getElementById("clock");

const updateClock = () => {
  const time = new Date();

  const get = (prop) => time[`get${prop}`]();

  const pad = (number) => number.toString(10).padStart(2, "0");

  clockElement.textContent =
    `${weekDays[get("Day")]}, ${get("Date")} ${months[get("Month")]} ${get("FullYear")}, \
${get("Hours")}:${pad(get("Minutes"))}:${pad(get("Seconds"))}`;
};

window.setInterval(updateClock, 1000);

/*global getCurrentHour, getDayIndex, data */
/*exported updateTimeTable, hideTimeTable */

const getTimeTable = (className, time = new Date()) => {
  // CLASSNAME is the internal name, not the human readable name
  const classInfo = data[className],
        day = getDayIndex(time),
        hour = getCurrentHour(classInfo.hours, time),
        timeTable = classInfo.classes[day];

  if (day < 0) {
    return null;
  }

  let table = document.createElement("table");

  timeTable.forEach((hourData, index) => {
    let row = table.insertRow(),
        cell;
    cell = row.insertCell();
    cell.appendChild(
      document.createTextNode(classInfo.hours[index].join(" – ")));

    cell = row.insertCell();
    cell.appendChild(document.createTextNode(
      ((hourData.rawText.length !== 0)
       ? hourData.rawText
       : "—————")));

    if (index === hour) {
      row.classList.add("currentHour");
    }
  });

  return table;
};

const updateTimeTable = (className, time = new Date()) => {
  const table = getTimeTable(className, time);
  let timeTableElement = document.getElementById("timeTable");

  while (timeTableElement.firstChild) {
    timeTableElement.removeChild(timeTableElement.firstChild);
  }

  if (table === null) {
    return;
  }
  
  let nameElement = document.createElement("h1");
  nameElement.appendChild(document.createTextNode(data[className].title));
  timeTableElement.appendChild(nameElement);
  timeTableElement.appendChild(table);
};

const hideTimeTable = () => ["timeTable", "showTimeTable"]
      .forEach((id) => document.getElementById(id).style.display = "none");

document.getElementById("showTimeTable").addEventListener(
  "mouseover", () =>
    document.getElementById("timeTable").style.display = "block");

document.getElementById("showTimeTable").addEventListener(
  "mouseout", () =>
    document.getElementById("timeTable").style.display = "none");

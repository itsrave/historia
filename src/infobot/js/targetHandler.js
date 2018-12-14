/*global searchTargets, data, updateTimeTable, updateTargets,
  getCurrentHourData, completer */
/*exported targetHandler */

const targetHandler = (option, {focus = true, clearInput = false} = {}) => {
  const target = searchTargets[option];
  let success = false;

  if (data[target] && data[target].classes) {
    updateTimeTable(target);
    if (document.getElementById("timeTable").children.length !== 0) {
      document.getElementById("showTimeTable").style.display = "block";
    }
  } else {
    document.getElementById("showTimeTable").style.display = "none";
  }

  // console.log(`Selected: "${option}" -> "${target}"`);
  if (/^s[0-9]+$/.test(target) && typeof data[target] === "object") {
    updateTargets([{
      name: option,
      target: target,
    }]);
    success = true;
  }

  if (!success && /^[on]\d+$/.test(target)) {
    const hourData = getCurrentHourData(data[target]);
    if (typeof hourData === "object" && hourData[0] !== undefined) {
      updateTargets(hourData.map(
        (hour) => ({
          name: ((hour.teacher !== undefined)
                 ? `${hour.subject} z ${data.teachers[hour.teacher]}`
                 : hour.subject),
          target: hour.classroom,
        })));
    } else {
      let message;
      switch (target[0]) {
        case "o":
          message = "Klasa nie ma żadnych lekcji";
          break;
        case "n":
          message = "Nauczyciel nie ma żadnych lekcji";
          break;
      }

      updateTargets([{
        name: message,
        target: "",
      }]);
    }
    success = true;
  }

  // try showing the override id if nothing else was found
  if (!success && typeof target === "string") {
    updateTargets([{
      name: option,
      target,
    }]);
    success = true;
  }

  if (focus) {
    completer.inputElement.focus();
  }

  if (clearInput) {
    completer.clearInput();
  }

  if (!success) {
    console.error(`Unknown target "${option}" -> "${target}"`);
    updateTargets([{
      name: "Nieznany cel",
      target: "",
    }]);
  }
};

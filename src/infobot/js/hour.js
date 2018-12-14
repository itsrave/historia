/*exported getCurrentHourData */

const parseTimeStamp = ([hour, minute, second = 0]) => {
  let timeStamp = new Date();
  timeStamp.setHours(hour);
  timeStamp.setMinutes(minute);
  timeStamp.setSeconds(second);
  return timeStamp;
};

const getCurrentHour = (hours, time = new Date()) =>
      hours.findIndex((hour) => parseTimeStamp(hour[1].split(":")) >= time);

const getDayIndex = (time = new Date()) => {
  let day = time.getDay();
  if (day >= 1 && day < 6) {
    return day - 1;
  } else {
    return -1;
  }
};

const getCurrentHourData = (table, time = new Date()) => {
  const dayIndex = getDayIndex(time),
        hourIndex = getCurrentHour(table.hours, time);

  if (dayIndex === -1 || hourIndex === -1) {
    return [];
  } else if (table.classes[dayIndex] && table.classes[dayIndex][hourIndex]) {
    return table.classes[dayIndex][hourIndex].parsedData;
  } else {
    return [];
  }
};

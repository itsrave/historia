/*global getJSON, completer, bindClassroomClickEvents, bindMiniClickEvents */
/*exported getClassroomId */

let data, searchTargets;

const dataDir = "/plan/results/",
      listName = "files.json";

const extractData = (data) => {
  let result = {},
      {classrooms, teachers, overrides} = data;

  const objForEach = (obj, func) => Object.keys(obj)
        .forEach((key) => func(key, obj[key]));

  const valToKey = (key, val) => result[val] = key;

  objForEach(classrooms, valToKey);
  objForEach(teachers, valToKey);

  Object.keys(data)
    .filter((key) => /^o\d+$/.test(key))
    .forEach((key) => result[data[key].title] = key);

  result = Object.assign({}, overrides, result);

  return result;
};

const getClassroomId = (filename) => {
  let fullName = data.classrooms[filename];
  if (typeof fullName === "string") {
    let result = `s${data.classrooms[filename].split(" ")[0].toLowerCase()}`;
    return result;
  } else {
    return filename;
  }
};

const loadJSONData = () =>
      getJSON(`${dataDir}${listName}`)
      .then((list) => {
        let result = {};
        Promise.all(list.map(
          (file) => getJSON(`${dataDir}${file}.json`)
            .then((JSONdata) => result[file] = JSONdata)))
          .then(() => data = result)
          .then(() => searchTargets = extractData(data))
          .then(() => bindClassroomClickEvents(searchTargets))
          .then(() => bindMiniClickEvents())
          .then(() =>
                completer.updateCompletions(
                  Object.keys(searchTargets).sort()))
          .catch(console.error);
      })
      .catch(console.error);

loadJSONData();

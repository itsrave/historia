/*global completer, getDOM, insertSVG, range, getClassroomId, targetHandler,
  setTargetsVisibility */
/*exported getDOM, showClassroom, bindClassroomClickEvents,
  bindMiniClickEvents */

const floorNames =
      Object.seal([...[...range(0, 3)].map((n) => n.toString(10)), "w", "p"]),
      miniIds =
      Object.seal(["mini-plus-w", "arr-pw", "arr-ur-here", "span-label-pw",
                   "span-label-ur-here", "dot-ur-here", "tspan3797"]);
// FIXME: take care of that tspan3797

let svg;

const displayAdditionalMini = (display) => {
  // DISPLAY should be a Boolean
  display = ((display) ? "block" : "none");
  miniIds.forEach((id) => {
    let element = svg.getElementById(id);
    if (element !== null && element.style) {
      element.style.display = display;
    }
  });
};

const showFloor = (floorId) => {
  // FLOORID should be a String
  for (let n of floorNames) {
    const displayStyle = (n === floorId) ? "block" : "none";
    // id names are inconsistent
    let floorScheme = svg.getElementById(`p${n}-scheme`),
        floorArrow  = svg.getElementById(`arr-p${n}`),
        floorLabel  = svg.getElementById(`span-label-p${n}`);

    [floorScheme, floorArrow, floorLabel]
      .forEach((element) => {
        if (element !== null && element.style) {
          element.style.display = displayStyle;
        }
      });
    displayAdditionalMini(floorId === "w");
    if (floorId === "w") {
      ["arr-p0", "span-label-p0"].forEach(
        (id) => svg.getElementById(id).style.display = "block");
    }
  }
};

const getClassroomFloor = (classroomName) => {
  // CLASSROOMNAME should be a String
  let classroom = svg.getElementById(classroomName);

  if (classroom === null) {
    return "";
  }

  let parentId = classroom.parentElement.id,
      floorName = /^p([^-]+)-scheme$/.exec(parentId);

  if (floorName !== null && floorName[1]) {
    return floorName[1];
  } else {
    return "";
  }
};

const unhighlightClassrooms = () =>
      [...svg.getElementsByClassName("plan-highlight")]
      .forEach((classroom) => classroom.setAttribute("class", ""));

const showClassroom = (classroomName) => {
  // CLASSROOMNAME should be a String

  let classroom = svg.getElementById(classroomName);

  if (classroom === null) {     // classroom doesn't exist
    return false;
  } else {
    unhighlightClassrooms();
    showFloor(getClassroomFloor(classroomName));
    classroom.setAttribute("class", "plan-highlight");
    return true;
  }
};

const showInitialState = () => {
  unhighlightClassrooms();
  showFloor("0");
};

const bindClassroomClickEvents = (targets) => {
  let validTargets = {};

  Object.entries(targets)
    .forEach(([key, val]) => validTargets[getClassroomId(val)] = key);

  floorNames.forEach((floor) => {
    for (let element of svg.getElementById(`p${floor}-scheme`).children) {
      if (validTargets[element.id] !== undefined) {
        element.classList.add("clickable");
        element.addEventListener(
          "click", () => targetHandler(
            validTargets[element.id],
            {
              focus: false,
              clearInput: true,
            }));
      }
    }
  });
};

const bindMiniClickEvents = () => {
  for (let mini of svg.getElementById("mini").children) {
    let match = /^mini-p(.+)$/.exec(mini.id);
    if (match !== null && floorNames.includes(match[1])) {
      mini.classList.add("clickable");
      mini.addEventListener("click", () => {
        if (svg.getElementById(`p${match[1]}-scheme`)
            .style.display !== "block") {
          unhighlightClassrooms();
          completer.clearInput();
          setTargetsVisibility(false);
          showFloor(match[1]);
        }
      });
    }
  }
};

const svgInit = () => insertSVG("assets/plan.svg",
                                document.getElementById("plan"))
      .then((svgElement) => {
        svg = svgElement;
        const resize = () => window.requestAnimationFrame(() => {
          svg.setAttribute("width", `${window.innerWidth}px`);
          svg.setAttribute("height", `${window.innerHeight}px`);
        });

        resize();
        window.addEventListener("resize", resize);
      })
      .then(showInitialState);

svgInit();
